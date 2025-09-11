import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";

const AdminTechInterview = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  const techin = [
    {
      tiId: "8171H347-JAK0-31N8-WO47-29KZMN0EPL48",
      fullName: "Preet Bhimani",
      title: "Jr. Software Developer",
      email: "preet@gmail.com",
      date: "2024-12-21",
      isClear: "Pass",
      status: "Completed",
      interviewerName: "Paresh Tanna",
    },
    {
      tiId: "0192R489-HFB7-83B4-DJ67-10URDK2QLZ75",
      fullName: "Rutvik Dollar",
      title: "Quality Analyst",
      email: "rutvik@gamil.com",
      date: "2025-07-14",
      isClear: "Fail",
      status: "Completed",
      interviewerName: "Nirav Bhatt",
    }
  ]

  return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
    {/* Navbar */}
    <Navbar />

    {/* Main Layout */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-semibold mb-4 text-blue-400">Admin Technical Interview</h1>

        {/* Add New Tech Interview */}
        <div className="flex gap-3 mb-4 justify-end">
          <button className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm" onClick={() => navigate("/admin-add-techinterview")}>
            + Add Tech Interview
          </button>
        </div>

        <div className="space-y-2">
          {techin.map((tech) => (
            <div
              key={tech.tiId}
              className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 flex-1">
                <div className="grid grid-cols-4 gap-x-6 gap-y-1 flex-1">
                  <p><span className="font-medium text-amber-200">TiId:</span> {tech.tiId}</p>
                  <p><span className="font-medium text-amber-200">Full Name:</span> {tech.fullName}</p>
                  <p><span className="font-medium text-amber-200">Title:</span> {tech.title}</p>
                  <p><span className="font-medium text-amber-200">Email:</span> {tech.email}</p>
                  <p><span className="font-medium text-amber-200">Date:</span> {tech.date}</p>
                  <p>
                    <span className="font-medium text-amber-200">isClear:</span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${tech.isClear === "Pass"
                        ? "bg-emerald-800 text-emerald-200"
                        : tech.isClear === "Wait"
                          ? "bg-yellow-800 text-yellow-200"
                          : "bg-rose-800 text-rose-200"}`}>
                      {tech.isClear}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-amber-200">status:</span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${tech.status === "Completed"
                        ? "bg-emerald-800 text-emerald-200"
                        : "bg-yellow-800 text-yellow-200"}`}>
                      {tech.status}
                    </span>
                  </p>
                  <p><span className="font-medium text-amber-200">Rating:</span> {tech.rating}</p>
                </div>
              </div>
              {/* Bottons */}
              <div className="flex gap-2 ml-4">
                <button className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs" onClick={() => navigate('/admin-update/jobapplication/9834B398-CCC4-57D0-CE34-19EEBF3GFD46')}>
                  <Eye size={14} /> View
                </button>
                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-update/jobapplication/9834B398-CCC4-57D0-CE34-19EEBF3GFD46')}>
                  <Edit size={14} /> Update
                </button>
                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
};

export default AdminTechInterview;
