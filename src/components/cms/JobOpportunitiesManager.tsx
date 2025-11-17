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

interface Job {
  id: string;
  title: string;
  location: string;
  department: string;
  description: string;
  requirements: string;
  deadline: string;
  status: string;
}

export const JobOpportunitiesManager = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    department: "",
    description: "",
    requirements: "",
    deadline: "",
    application_instructions: "",
    status: "open",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch job opportunities");
      return;
    }

    setJobs(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingJob) {
      const { error } = await supabase
        .from("job_opportunities")
        .update(formData)
        .eq("id", editingJob.id);

      if (error) {
        toast.error("Failed to update job");
        return;
      }
      toast.success("Job updated successfully");
    } else {
      const { error } = await supabase.from("job_opportunities").insert([formData]);

      if (error) {
        toast.error("Failed to create job");
        return;
      }
      toast.success("Job created successfully");
    }

    setIsDialogOpen(false);
    resetForm();
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const { error } = await supabase.from("job_opportunities").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete job");
      return;
    }

    toast.success("Job deleted successfully");
    fetchJobs();
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      location: job.location || "",
      department: job.department || "",
      description: job.description,
      requirements: job.requirements || "",
      deadline: job.deadline || "",
      application_instructions: "",
      status: job.status,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      location: "",
      department: "",
      description: "",
      requirements: "",
      deadline: "",
      application_instructions: "",
      status: "open",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Opportunities</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job" : "Post New Job"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingJob ? "Update Job" : "Post Job"}
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
              <TableHead>Location</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.location || "-"}</TableCell>
                <TableCell>{job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${job.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
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