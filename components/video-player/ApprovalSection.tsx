"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import { Approval } from "@/types/database";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Celebration from "@/components/animations/Celebration";

interface ApprovalSectionProps {
  videoId: string;
}

export default function ApprovalSection({ videoId }: ApprovalSectionProps) {
  const { data: session } = useSession();
  const [approval, setApproval] = useState<Approval | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  useEffect(() => {
    fetchApproval();
  }, [videoId, session]);

  const fetchApproval = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/approvals?video_id=${videoId}`);
      if (response.ok) {
        const data = await response.json();
        // Find current user's approval
        const userApproval = data.approvals?.find(
          (a: Approval) => a.user_id === session.user.id
        );
        if (userApproval) {
          setApproval(userApproval);
          setNotes(userApproval.notes || "");
        }
      }
    } catch (error) {
      console.error("Error fetching approval:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approved: boolean) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: videoId,
          approved,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setApproval(data.approval);
        setShowForm(false);
        if (approved) {
          setCelebrationMessage("Video Approved! 🎉");
          setShowCelebration(true);
        }
        toast.success(approved ? "Video approved" : "Approval updated");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save approval");
      }
    } catch (error) {
      console.error("Error saving approval:", error);
      toast.error("Failed to save approval");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading approval status...</div>;
  }

  return (
    <>
      <Celebration
        show={showCelebration}
        message={celebrationMessage}
        onComplete={() => setShowCelebration(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Approval Status</h2>

      <div className="space-y-4">
        {approval ? (
          <>
            <div className="flex items-center space-x-2">
              {approval.approved ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Approved</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 font-medium">Not Approved</span>
                </>
              )}
              {approval.approved_at && (
                <span className="text-sm text-gray-500">
                  on {new Date(approval.approved_at).toLocaleDateString()}
                </span>
              )}
            </div>

            {approval.notes && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{approval.notes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Circle className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">No approval yet</span>
          </div>
        )}

        {/* Quick approve/reject buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: approval?.approved !== true ? 1.02 : 1 }}
            whileTap={{ scale: approval?.approved !== true ? 0.98 : 1 }}
            onClick={() => handleApproval(true)}
            disabled={submitting || (approval?.approved === true)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg disabled:shadow-none transition-all"
          >
            {submitting ? "Saving..." : approval?.approved ? "✓ Approved" : "Approve"}
          </motion.button>
          <motion.button
            whileHover={{ scale: approval?.approved !== false ? 1.02 : 1 }}
            whileTap={{ scale: approval?.approved !== false ? 0.98 : 1 }}
            onClick={() => handleApproval(false)}
            disabled={submitting || (approval?.approved === false)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg disabled:shadow-none transition-all"
          >
            {submitting ? "Saving..." : approval?.approved === false ? "✗ Rejected" : "Reject"}
          </motion.button>
        </div>

        {/* Optional notes section */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          {showForm ? "Hide Notes" : "Add Notes (Optional)"}
        </button>

        {showForm && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add approval notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
            <button
              onClick={() => handleApproval(approval?.approved ?? true)}
              disabled={submitting}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Save Notes
            </button>
          </div>
        )}
      </div>
      </motion.div>
    </>
  );
}

