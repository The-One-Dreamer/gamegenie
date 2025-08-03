import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2, Download, Upload, Info, Palette, Brain, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  onClearAllData: () => void;
  totalSessions: number;
}

export function SettingsDialog({ onClearAllData, totalSessions }: SettingsDialogProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [aiModel, setAiModel] = useState("gemini-2.5-flash");
  const [language, setLanguage] = useState("en");
  const { toast } = useToast();

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      onClearAllData();
      toast({
        title: "Data Cleared",
        description: "All chat history has been cleared successfully.",
      });
    }
  };

  const handleExportData = () => {
    // In a real app, this would export the user's data
    toast({
      title: "Export Started",
      description: "Your chat history is being prepared for download.",
    });
  };

  const handleImportData = () => {
    // In a real app, this would open a file picker
    toast({
      title: "Import Feature",
      description: "Import functionality will be available soon.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-3 text-[var(--game-text-muted)] hover:text-[var(--game-text)] hover:bg-[var(--game-secondary)] transition-all duration-200 w-full justify-start rounded-xl">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[var(--game-card)] border-[var(--game-border)] text-[var(--game-text)]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[var(--game-text)]">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-[var(--game-accent)]" />
              <Label className="text-sm font-medium text-[var(--game-text)]">Appearance</Label>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm text-[var(--game-text-muted)]">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save" className="text-sm text-[var(--game-text-muted)]">Auto-save Conversations</Label>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-[var(--game-border)]" />

          {/* AI Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-[var(--game-accent)]" />
              <Label className="text-sm font-medium text-[var(--game-text)]">AI Preferences</Label>
            </div>
            <div className="space-y-3 pl-6">
              <div className="space-y-2">
                <Label className="text-sm text-[var(--game-text-muted)]">AI Model</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="bg-[var(--game-secondary)] border-[var(--game-border)] text-[var(--game-text)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--game-card)] border-[var(--game-border)]">
                    <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Free)</SelectItem>
                    <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (Requires API Key)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[var(--game-text-muted)]">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-[var(--game-secondary)] border-[var(--game-border)] text-[var(--game-text)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--game-card)] border-[var(--game-border)]">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-[var(--game-border)]" />

          {/* Data Management */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[var(--game-accent)]" />
              <Label className="text-sm font-medium text-[var(--game-text)]">Data Management</Label>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--game-text-muted)]">Export Chat History</p>
                  <p className="text-xs text-[var(--game-text-muted)] opacity-70">{totalSessions} conversations</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="bg-[var(--game-secondary)] border-[var(--game-border)] text-[var(--game-text)] hover:bg-[var(--game-accent)]/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--game-text-muted)]">Import Chat History</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportData}
                  className="bg-[var(--game-secondary)] border-[var(--game-border)] text-[var(--game-text)] hover:bg-[var(--game-accent)]/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-400">Clear All Data</p>
                  <p className="text-xs text-[var(--game-text-muted)] opacity-70">This cannot be undone</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearData}
                  className="bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <Separator className="bg-[var(--game-border)]" />

          {/* About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[var(--game-accent)]" />
              <Label className="text-sm font-medium text-[var(--game-text)]">About</Label>
            </div>
            <div className="pl-6 space-y-2">
              <p className="text-sm text-[var(--game-text-muted)]">Game Suggester v1.0</p>
              <p className="text-xs text-[var(--game-text-muted)] opacity-70">
                Powered by Google Gemini AI for intelligent game recommendations
              </p>
              <p className="text-xs text-[var(--game-text-muted)] opacity-70">
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}