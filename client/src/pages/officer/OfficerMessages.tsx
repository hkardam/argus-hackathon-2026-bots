import { Search, Send, Paperclip, User, FileText } from 'lucide-react';

export default function OfficerMessages() {
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-500 mt-1">Communicate with applicants regarding their submissions.</p>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex">
        {/* Sidebar / Thread List */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Active Thread */}
            <div className="p-4 border-b border-slate-200 bg-white cursor-pointer border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-900 text-sm truncate">APP-204: Village Water...</h3>
                <span className="text-xs text-slate-500 shrink-0">2h ago</span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">Absolutely. The project will serve 350 households...</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-bold text-slate-900">APP-204: Village Water Infrastructure</h2>
              <p className="text-xs text-slate-500 mt-0.5">Applicant: Green Future Foundation</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Under Review
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
            {/* Sent Message */}
            <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                  <span className="font-semibold text-sm text-slate-900">You</span>
                  <span className="text-xs text-slate-500">Today at 10:30 AM</span>
                </div>
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-4 shadow-sm text-sm">
                  <p>Hello Anita,</p>
                  <p className="mt-2">Thank you for submitting the application for the Village Water Infrastructure project. During our initial review, we noticed that the beneficiary demographics section is a bit broad.</p>
                  <p className="mt-2">Could you please clarify the breakdown of beneficiaries by age group and gender? This will help our reviewers better understand the impact.</p>
                </div>
              </div>
            </div>

            {/* Received Message */}
            <div className="flex gap-4 max-w-2xl">
              <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-emerald-700 font-bold text-xs">AS</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm text-slate-900">Anita Sharma</span>
                  <span className="text-xs text-slate-500">Today at 11:15 AM</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-sm text-slate-700">
                  <p>Hi,</p>
                  <p className="mt-2">Absolutely. The project will serve 350 households, totaling approximately 1,500 individuals. Here is the breakdown:</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Adult Women: 450</li>
                    <li>Adult Men: 400</li>
                    <li>Children (under 18): 650</li>
                  </ul>
                  <p className="mt-2">I have also attached a detailed demographic survey report for your reference.</p>
                </div>
                {/* Attachment */}
                <div className="mt-2 flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 pr-4 shadow-sm w-fit">
                  <div className="bg-rose-100 p-1.5 rounded text-rose-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">Demographic_Survey.pdf</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-end gap-2">
              <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0">
                <Paperclip className="h-5 w-5" />
              </button>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <textarea 
                  placeholder="Type your message..." 
                  className="w-full max-h-32 min-h-[44px] p-3 bg-transparent outline-none resize-none text-sm text-slate-700"
                  rows={1}
                ></textarea>
              </div>
              <button className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm shrink-0">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
