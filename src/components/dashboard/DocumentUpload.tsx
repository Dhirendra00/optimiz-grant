import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, X, Loader2, CheckCircle2 } from "lucide-react";

interface UploadedDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

interface DocumentUploadProps {
  userId: string;
  organizationId: string;
  documentType: string;
  label: string;
  required?: boolean;
  accept?: string;
  existingDocument?: UploadedDocument | null;
  onUploadComplete: (doc: UploadedDocument) => void;
  onDelete?: (docId: string) => void;
}

const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentUpload = ({
  userId,
  organizationId,
  documentType,
  label,
  required = false,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  existingDocument,
  onUploadComplete,
  onDelete,
}: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 10MB limit.";
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${documentType}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("organization-documents")
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setProgress(95);

      // Save document record
      const { data: docData, error: dbError } = await supabase
        .from("organization_documents")
        .insert({
          organization_id: organizationId,
          user_id: userId,
          document_type: documentType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setProgress(100);

      toast({ title: "Success", description: "Document uploaded successfully" });
      onUploadComplete(docData);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!existingDocument || !onDelete) return;

    try {
      // Delete from storage
      await supabase.storage
        .from("organization-documents")
        .remove([existingDocument.file_path]);

      // Delete record
      await supabase
        .from("organization_documents")
        .delete()
        .eq("id", existingDocument.id);

      onDelete(existingDocument.id);
      toast({ title: "Deleted", description: "Document removed successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {existingDocument ? (
        <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">
                {existingDocument.file_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(existingDocument.file_size)}
              </p>
            </div>
          </div>
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />

          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop or{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX, JPG, PNG • Max 10MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
