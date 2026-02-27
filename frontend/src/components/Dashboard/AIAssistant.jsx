import React, { useState, useImperativeHandle, forwardRef } from "react";
import { 
  Sparkles, 
  Brain, 
  X, 
  Loader2, 
  TrendingUp, 
  FileText,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../../api.js";

const AIAssistant = forwardRef(({ user }, ref) => {

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [analysisType, setAnalysisType] = useState(null);
  const [error, setError] = useState(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openAndAnalyzeCourse(courseId, courseName) {
      setOpen(true);
      setTimeout(() => getCourseSummary(courseId, courseName), 300);
    },
    openAndAnalyzePlan() {
      setOpen(true);
      setTimeout(() => getPlanAnalysis(), 300);
    }
  }));

  const getOverallSummary = async () => {
    setLoading(true);
    setError(null);
    setAnalysisType('overall');
    
    try {
      const res = await api.post('/api/ai-assistant/analyze/', {
        type: 'overall'
      });
      
      setSummary(res.data.summary);
    } catch (error) {
      console.error('AI analysis error:', error);
      setError(error.response?.data?.error || 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  const getCourseSummary = async (courseId, courseName) => {
    setLoading(true);
    setError(null);
    setAnalysisType(`course-${courseName}`);
    
    try {
      const res = await api.post('/api/ai-assistant/analyze/', {
        type: 'course',
        course_id: courseId
      });
      
      setSummary(res.data.summary);
    } catch (error) {
      console.error('AI analysis error:', error);
      setError(error.response?.data?.error || 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  const getPlanAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysisType('plan');
    
    try {
      const res = await api.post('/api/ai-assistant/analyze/', {
        type: 'plan'
      });
      
      setSummary(res.data.summary);
    } catch (error) {
      console.error('AI analysis error:', error);
      setError(error.response?.data?.error || 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
        aria-label="Cognito AI Assistant"
      >
        <Sparkles size={28} className="text-white animate-pulse" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
      </button>

      {/* AI Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg normal_text_4">{t("dashboard.ai_assistant_name")}</h3>
                    <p className="text-white/80 text-xs normal_text_4">{t("dashboard.ai_assistant_descr")}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 space-y-3 border-b border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 normal_text_4">
                {t("dashboard.ai_quick_analysis")}
              </h4>
              
              <button
                onClick={getOverallSummary}
                disabled={loading}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-md transition group"
              >
                <TrendingUp className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" size={20} />
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm normal_text_4">
                    {t("dashboard.ai_overall_performance")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 normal_text_4">
                    {t("dashboard.ai_overall_performance_descr")}
                  </p>
                </div>
              </button>

              <button
                onClick={getPlanAnalysis}
                disabled={loading}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition group"
              >
                <FileText className="text-green-600 dark:text-green-400 group-hover:scale-110 transition" size={20} />
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm normal_text_4">
                    {t("dashboard.ai_analyze_individual_plan")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 normal_text_4">
                    {t("dashboard.ai_analyze_individual_plan_descr")}
                  </p>
                </div>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 normal_text_4">
                    {t("dashboard.ai_analyze_in_progress")}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-200 text-sm">
                        {t("dashboard.ai_analyze_error")}
                      </p>
                      <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {summary && !loading && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg p-1">
                    <div className="bg-white dark:bg-gray-800 rounded-md p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="text-purple-600 dark:text-purple-400" size={18} />
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {t("dashboard.ai_analyze")}
                        </span>
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {summary}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSummary(null);
                      setAnalysisType(null);
                      setError(null);
                    }}
                    className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    {t("dashboard.ai_analyze_clear")}
                  </button>
                </div>
              )}

              {!summary && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="text-purple-600 dark:text-purple-400" size={32} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t("dashboard.ai_select_analysis")}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                {t("dashboard.ai_powered_by")} • {t("dashboard.ai_limit_info")}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default AIAssistant;