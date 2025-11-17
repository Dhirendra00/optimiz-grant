import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Grant {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: string;
  deadline: string;
  funding_amount: string;
  application_link: string;
  status: string;
  categories: string[];
}

export const GrantsManager = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eligibility_criteria: "",
    deadline: "",
    funding_amount: "",
    application_link: "",
    status: "active",
    categories: "",
  });

  useEffect(() => {
    fetchGrants();
  }, []);

  const fetchGrants = async () => {
    const { data, error } = await supabase
      .from("grants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch grants");
      return;
    }

    setGrants(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const grantData = {
      ...formData,
      categories: formData.categories.split(",").map((c) => c.trim()).filter(Boolean),
    };

    if (editingGrant) {
      const { error } = await supabase
        .from("grants")
        .update(grantData)
        .eq("id", editingGrant.id);

      if (error) {
        toast.error("Failed to update grant");
        return;
      }
      toast.success("Grant updated successfully");
    } else {
      const { error } = await supabase.from("grants").insert([grantData]);

      if (error) {
        toast.error("Failed to create grant");
        return;
      }
      toast.success("Grant created successfully");
    }

    setIsDialogOpen(false);
    resetForm();
    fetchGrants();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this grant?")) return;

    const { error } = await supabase.from("grants").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete grant");
      return;
    }

    toast.success("Grant deleted successfully");
    fetchGrants();
  };

  const handleEdit = (grant: Grant) => {
    setEditingGrant(grant);
    setFormData({
      title: grant.title,
      description: grant.description,
      eligibility_criteria: grant.eligibility_criteria || "",
      deadline: grant.deadline || "",
      funding_amount: grant.funding_amount || "",
      application_link: grant.application_link || "",
      status: grant.status,
      categories: grant.categories?.join(", ") || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingGrant(null);
    setFormData({
      title: "",
      description: "",
      eligibility_criteria: "",
      deadline: "",
      funding_amount: "",
      application_link: "",
      status: "active",
      categories: "",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Featured Grants</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Grant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGrant ? "Edit Grant" : "Create New Grant"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Grant Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility_criteria}
                  onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="funding">Funding Amount</Label>
                <Input
                  id="funding"
                  value={formData.funding_amount}
                  onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })}
                  placeholder="e.g., $10,000 - $50,000"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="link">Application Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.application_link}
                  onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="categories">Categories (comma-separated)</Label>
                <Input
                  id="categories"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="Education, Health, Environment"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingGrant ? "Update Grant" : "Create Grant"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Funding Amount</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grants.map((grant) => (
              <TableRow key={grant.id}>
                <TableCell className="font-medium">{grant.title}</TableCell>
                <TableCell>{grant.funding_amount || "-"}</TableCell>
                <TableCell>{grant.deadline ? new Date(grant.deadline).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${grant.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {grant.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(grant)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(grant.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};