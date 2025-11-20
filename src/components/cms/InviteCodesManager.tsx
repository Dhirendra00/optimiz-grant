import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Plus, Trash2 } from "lucide-react";

interface InviteCode {
  id: string;
  code: string;
  role: string;
  expires_at: string | null;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export const InviteCodesManager = () => {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState({
    role: "organization",
    expiresInDays: "30"
  });

  useEffect(() => {
    fetchInviteCodes();
  }, []);

  const fetchInviteCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("invite_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInviteCodes(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch invite codes");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if ((i + 1) % 4 === 0 && i < 11) code += '-';
    }
    return code;
  };

  const handleCreateInvite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const code = generateRandomCode();
      const expiresAt = newCode.expiresInDays
        ? new Date(Date.now() + parseInt(newCode.expiresInDays) * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from("invite_codes")
        .insert([{
          code,
          role: newCode.role as "admin" | "consultant" | "organization" | "visitor",
          expires_at: expiresAt,
          created_by: user.id
        }]);

      if (error) throw error;

      toast.success("Invite code created successfully");
      setIsCreateDialogOpen(false);
      fetchInviteCodes();
    } catch (error: any) {
      toast.error("Failed to create invite code: " + error.message);
    }
  };

  const handleDeleteInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from("invite_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Invite code deleted");
      fetchInviteCodes();
    } catch (error: any) {
      toast.error("Failed to delete invite code");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "consultant": return "default";
      default: return "secondary";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading invite codes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Invite Codes</CardTitle>
            <CardDescription>Generate and manage invite codes with assigned roles</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invite Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invite Code</DialogTitle>
                <DialogDescription>
                  Generate a new invite code with a pre-assigned role
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newCode.role}
                    onValueChange={(value) => setNewCode({ ...newCode, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires">Expires In (days)</Label>
                  <Input
                    id="expires"
                    type="number"
                    value={newCode.expiresInDays}
                    onChange={(e) => setNewCode({ ...newCode, expiresInDays: e.target.value })}
                    placeholder="Leave empty for no expiration"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvite}>Generate Code</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Used By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inviteCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No invite codes yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              inviteCodes.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-mono text-sm">
                    {invite.code}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(invite.role)}>
                      {invite.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={invite.used ? "outline" : "default"}>
                      {invite.used ? "Used" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {invite.expires_at
                      ? new Date(invite.expires_at).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {invite.used_at
                      ? new Date(invite.used_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(invite.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInvite(invite.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};