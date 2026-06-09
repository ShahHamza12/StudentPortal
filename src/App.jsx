import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, UserCircle, BookOpen, Users, 
  CheckCircle, GraduationCap, Clock, Calendar, 
  Save, ChevronRight, LogOut, UserPlus, FileEdit,
  ShieldCheck, LogIn, ClipboardList, PlusCircle,
  CreditCard, Receipt, AlertCircle, BarChart3, Loader2
} from 'lucide-react';
import { authAPI, studentsAPI, teachersAPI } from './services/api';

const App = () => {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('overview');
  const [role, setRole] = useState('student'); 
  const [db, setDb] = useState({ users: [], students: [], teachers: [] });
  const [showToast, setShowToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // System setup for full screen
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; display: block !important; overflow: hidden; }
      * { transition: all 0.2s ease-in-out; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    `;
    document.head.appendChild(style);
  }, []);

  const notify = useCallback((msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  }, []);

  const loadPortalData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [students, teachers] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
      ]);

      setDb({ users: [], students, teachers });
    } catch (error) {
      notify(`Database error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  const replaceStudent = (updatedStudent) => {
    setDb((current) => ({
      ...current,
      students: current.students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      ),
    }));
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userId = data.get('userId');
    const password = data.get('password');
    const name = data.get('name');

    setIsLoading(true);
    try {
      if (type === 'signup') {
        await authAPI.signup(userId, password, name, role);
        await loadPortalData();
        notify("Registration Successful!");
        setView('login');
      } else {
        const result = await authAPI.login(userId, password);
        if (result.user.role !== role) {
          notify(`This account is registered as ${result.user.role}`);
          return;
        }

        setUser(result.user);
        setView('dashboard');
        notify(`Welcome back, ${result.user.name}`);
      }
    } catch (error) {
      notify(error.message || "Invalid Credentials!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const sId = data.get('sId');
    const sName = data.get('sName');
    const attendance = parseInt(data.get('sAtt')) || 0;

    try {
      const newStudent = await studentsAPI.create({ id: sId, name: sName, attendance });
      setDb((current) => ({ ...current, students: [...current.students, newStudent] }));
      notify("Student added successfully!");
      e.target.reset();
    } catch (error) {
      notify(error.message);
    }
  };

  const updateMarks = async (sId, subject, val) => {
    const student = db.students.find((item) => item.id === sId);
    if (!student) return;

    const marks = { ...student.marks, [subject]: parseInt(val) || 0 };
    replaceStudent({ ...student, marks });

    try {
      const updated = await studentsAPI.updateMarks(sId, marks);
      replaceStudent(updated);
    } catch (error) {
      notify(error.message);
      replaceStudent(student);
    }
  };

  const updateAttendanceLog = async (sId, month, value) => {
    const student = db.students.find((item) => item.id === sId);
    if (!student) return;

    const attendanceLog = student.attendanceLog.map((log) =>
      log.month === month ? { ...log, value: parseInt(value) || 0 } : log
    );
    const average = attendanceLog.length
      ? Math.round(attendanceLog.reduce((total, log) => total + Number(log.value), 0) / attendanceLog.length)
      : 0;

    replaceStudent({ ...student, attendanceLog, attendance: average });

    try {
      const updated = await studentsAPI.addAttendanceLog(sId, month, parseInt(value) || 0);
      replaceStudent(updated);
    } catch (error) {
      notify(error.message);
      replaceStudent(student);
    }
  };

  if (view !== 'dashboard') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-6">
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-10 text-center">
            <div className="inline-block p-4 bg-blue-600 rounded-3xl text-white mb-6 shadow-xl shadow-blue-100">
              <GraduationCap size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">EduPortal</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">
              {view === 'login' ? "Access Your Account" : "Create New Account"}
            </p>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button onClick={() => setRole('student')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Student</button>
              <button onClick={() => setRole('teacher')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'teacher' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Teacher</button>
            </div>

            <form onSubmit={(e) => handleAuth(e, view === 'login' ? 'login' : 'signup')} className="space-y-4">
              {view === 'signup' && (
                <input name="name" type="text" placeholder="Full Name" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700" />
              )}
              <input name="userId" type="text" placeholder="User ID" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700" />
              <input name="password" type="password" placeholder="Password" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700" />
              
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all mt-4 flex items-center justify-center gap-3">
                {view === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                <span>{view === 'login' ? 'SIGN IN' : 'REGISTER'}</span>
              </button>
            </form>

            <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="mt-8 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
              {view === 'login' ? "New here? Create an account" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        {showToast && (
          <div className="fixed bottom-10 bg-slate-900 text-white px-8 py-4 rounded-full text-xs font-black tracking-widest shadow-2xl animate-bounce">{showToast}</div>
        )}
      </div>
    );
  }

  const currentUserData = user.role === 'teacher' 
    ? db.teachers.find(t => t.id === user.id) 
    : db.students.find(s => s.id === user.id);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col py-8 px-6 h-screen shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100"><GraduationCap size={28} /></div>
          <span className="text-2xl font-black tracking-tighter uppercase">EduPortal</span>
        </div>

        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
          <SidebarLink icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          {user.role === 'teacher' ? (
            <>
              <SidebarLink icon={ClipboardList} label="Class Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
              <SidebarLink icon={UserPlus} label="Add Student" active={activeTab === 'manage'} onClick={() => setActiveTab('manage')} />
              <SidebarLink icon={FileEdit} label="Upload Marks" active={activeTab === 'grading'} onClick={() => setActiveTab('grading')} />
              <SidebarLink icon={BarChart3} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
            </>
          ) : (
            <>
              <SidebarLink icon={BookOpen} label="My Progress" active={activeTab === 'academics'} onClick={() => setActiveTab('academics')} />
              <SidebarLink icon={BarChart3} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
              <SidebarLink icon={Receipt} label="Academic Fees" active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} />
            </>
          )}
          <SidebarLink icon={UserCircle} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button onClick={() => { setView('login'); setUser(null); setActiveTab('overview'); }} className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl font-black text-rose-500 hover:bg-rose-50 transition-all uppercase text-[10px] tracking-[0.2em]"><LogOut size={20} /> <span>Log Out</span></button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">{activeTab.replace('_', ' ')}</h1>
            <p className="text-slate-500 mt-2 font-bold italic text-lg">Hello, {user.name} 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${user.role === 'teacher' ? 'bg-blue-600' : 'bg-emerald-500'} animate-pulse`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role} Portal</span>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Total Students" value={db.students.length} sub="Enrolled in DB" icon={Users} color="text-blue-600" bgColor="bg-blue-50" />
                <StatCard label="My Role" value={user.role.toUpperCase()} sub="System Access" icon={ShieldCheck} color="text-indigo-600" bgColor="bg-indigo-50" />
                <StatCard label="Session Year" value="2026-2027" sub="Active Term" icon={Calendar} color="text-emerald-600" bgColor="bg-emerald-50" />
              </div>
              {user.role === 'student' && currentUserData && (
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                   <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800"><Calendar className="text-blue-600" /> Monthly Attendance History</h3>
                   <div className="flex items-end justify-between h-56 gap-8 px-6">
                    {currentUserData.attendanceLog.map((log, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                        <div className="w-full bg-slate-50 rounded-2xl relative h-full flex flex-col justify-end overflow-hidden border border-slate-100">
                          <div className="w-full bg-blue-500 rounded-t-xl transition-all duration-1000 group-hover:bg-blue-600" style={{ height: `${log.value}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.month}</span>
                      </div>
                    ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm max-w-4xl animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                <div className="w-24 h-24 rounded-[32px] bg-blue-600 text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-blue-100">{user.name.charAt(0)}</div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
                  <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mt-1">{user.role} ID: {user.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileCard label="Academic Department" val={user.role === 'teacher' ? currentUserData?.department : "Computer Science & Engineering"} />
                <ProfileCard label="Verified Status" val="Authenticated Member" />
                <ProfileCard label="Account Level" val={user.role === 'teacher' ? "Faculty Administrator" : "Student View"} />
                <ProfileCard label="System Last Seen" val={new Date().toLocaleTimeString()} />
              </div>
            </div>
          )}

          {user.role === 'teacher' && activeTab === 'manage' && (
            <div className="space-y-10">
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3"><PlusCircle className="text-blue-600" /> Enroll New Student Entry</h3>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <input name="sId" placeholder="Reg ID (e.g S111)" required className="px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50" />
                  <input name="sName" placeholder="Full Student Name" required className="px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50" />
                  <input name="sAtt" type="number" placeholder="Attendance (%)" required className="px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50" />
                  <button className="bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 shadow-lg shadow-blue-100">Add Entry</button>
                </form>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <tr><th className="px-10 py-6">Identity Code</th><th className="px-10 py-6">Student Name</th><th className="px-10 py-6 text-center">Current Attendance</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {db.students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50"><td className="px-10 py-6 font-bold text-slate-500">{s.id}</td><td className="px-10 py-6 font-black text-slate-800">{s.name}</td><td className="px-10 py-6 text-center"><span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black">{s.attendance}%</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {user.role === 'teacher' && activeTab === 'grading' && (
            <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
               <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="font-black text-xl text-slate-800">Academic Grading Portal</h3><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live database synchronization enabled</p></div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400"><tr><th className="px-10 py-6">Student Records</th><th className="px-8 py-6 text-center">Mathematics</th><th className="px-8 py-6 text-center">Applied Science</th><th className="px-8 py-6 text-center">Computer Sc.</th></tr></thead>
                   <tbody className="divide-y divide-slate-50">
                    {db.students.map(s => (
                      <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-10 py-8"><p className="font-black text-slate-800 text-lg leading-tight">{s.name}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{s.id}</p></td>
                        <td className="px-8 py-8 text-center"><input type="number" value={s.marks.Math} onChange={(e) => updateMarks(s.id, 'Math', e.target.value)} className="w-20 px-3 py-2 rounded-xl bg-slate-100 border-none font-black text-center focus:ring-2 focus:ring-blue-500" /></td>
                        <td className="px-8 py-8 text-center"><input type="number" value={s.marks.Science} onChange={(e) => updateMarks(s.id, 'Science', e.target.value)} className="w-20 px-3 py-2 rounded-xl bg-slate-100 border-none font-black text-center focus:ring-2 focus:ring-blue-500" /></td>
                        <td className="px-8 py-8 text-center"><input type="number" value={s.marks.CS} onChange={(e) => updateMarks(s.id, 'CS', e.target.value)} className="w-20 px-3 py-2 rounded-xl bg-slate-100 border-none font-black text-center focus:ring-2 focus:ring-blue-500" /></td>
                      </tr>
                    ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {user.role === 'teacher' && activeTab === 'attendance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Class Average" value={`${db.students.length ? Math.round(db.students.reduce((total, s) => total + Number(s.attendance || 0), 0) / db.students.length) : 0}%`} sub="Attendance" icon={BarChart3} color="text-blue-600" bgColor="bg-blue-50" />
                <StatCard label="Shortage Risk" value={db.students.filter((s) => Number(s.attendance) < 75).length} sub="Below 75%" icon={AlertCircle} color="text-rose-600" bgColor="bg-rose-50" />
                <StatCard label="Records" value={db.students.reduce((total, s) => total + (s.attendanceLog?.length || 0), 0)} sub="Monthly Entries" icon={ClipboardList} color="text-emerald-600" bgColor="bg-emerald-50" />
              </div>
              <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-xl text-slate-800">Student Attendance Management</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly records are stored in SQLite</p>
                  </div>
                  {isLoading && <Loader2 className="animate-spin text-blue-600" />}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-8 py-6 min-w-56">Student</th>
                        <th className="px-6 py-6 text-center">Average</th>
                        <th className="px-6 py-6 text-center">Math</th>
                        <th className="px-6 py-6 text-center">Science</th>
                        <th className="px-6 py-6 text-center">CS</th>
                        {(db.students[0]?.attendanceLog || []).map((log) => (
                          <th key={log.month} className="px-4 py-6 text-center">{log.month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {db.students.map((s) => (
                        <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-8 py-7">
                            <p className="font-black text-slate-800 leading-tight">{s.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{s.id}</p>
                          </td>
                          <td className="px-6 py-7 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black ${s.attendance < 75 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{s.attendance}%</span>
                          </td>
                          <td className="px-6 py-7 text-center font-black text-slate-500">{s.marks.Math}</td>
                          <td className="px-6 py-7 text-center font-black text-slate-500">{s.marks.Science}</td>
                          <td className="px-6 py-7 text-center font-black text-slate-500">{s.marks.CS}</td>
                          {(s.attendanceLog || []).map((log) => (
                            <td key={`${s.id}-${log.month}`} className="px-4 py-7 text-center">
                              <input type="number" min="0" max="100" value={log.value} onChange={(e) => updateAttendanceLog(s.id, log.month, e.target.value)} className="w-16 px-3 py-2 rounded-xl bg-slate-100 border-none font-black text-center focus:ring-2 focus:ring-blue-500" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {user.role === 'student' && activeTab === 'attendance' && currentUserData && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Current Attendance" value={`${currentUserData.attendance}%`} sub="Average" icon={BarChart3} color="text-blue-600" bgColor="bg-blue-50" />
                <StatCard label="Required" value="75%" sub="Minimum Criteria" icon={ShieldCheck} color="text-emerald-600" bgColor="bg-emerald-50" />
                <StatCard label="Status" value={currentUserData.attendance >= 75 ? "Clear" : "Risk"} sub="Eligibility" icon={AlertCircle} color={currentUserData.attendance >= 75 ? "text-indigo-600" : "text-rose-600"} bgColor={currentUserData.attendance >= 75 ? "bg-indigo-50" : "bg-rose-50"} />
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800"><Calendar className="text-blue-600" /> Monthly Attendance History</h3>
                <div className="flex items-end justify-between h-64 gap-6 px-2">
                  {currentUserData.attendanceLog.map((log) => (
                    <div key={log.month} className="flex-1 flex flex-col items-center gap-4 group min-w-14">
                      <div className="w-full bg-slate-50 rounded-2xl relative h-full flex flex-col justify-end overflow-hidden border border-slate-100">
                        <div className={`w-full rounded-t-xl transition-all duration-1000 ${log.value < 75 ? 'bg-rose-500' : 'bg-blue-500 group-hover:bg-blue-600'}`} style={{ height: `${log.value}%` }}></div>
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.month}</span>
                        <span className="block text-xs font-black text-slate-700 mt-1">{log.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user.role === 'teacher' && activeTab === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {currentUserData?.schedule.map((slot, i) => (
                 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-200 flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm">
                    <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"><Clock size={32} /></div><div><h4 className="text-xl font-black text-slate-800">{slot.class}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{slot.day} • {slot.time}</p></div></div>
                    <div className="text-right"><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Room No.</p><p className="text-2xl font-black text-slate-800 tracking-tighter">{slot.room}</p></div>
                 </div>
               ))}
            </div>
          )}

          {user.role === 'student' && activeTab === 'academics' && currentUserData && (
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCard label="Mathematics" value={currentUserData.marks.Math} sub="IA Score" icon={BookOpen} color="text-blue-600" bgColor="bg-blue-50" />
                  <StatCard label="Applied Science" value={currentUserData.marks.Science} sub="IA Score" icon={ClipboardList} color="text-indigo-600" bgColor="bg-indigo-50" />
                  <StatCard label="Computer Science" value={currentUserData.marks.CS} sub="IA Score" icon={ShieldCheck} color="text-emerald-600" bgColor="bg-emerald-50" />
               </div>
               <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm text-center">
                  <div className="inline-block p-4 bg-amber-50 text-amber-600 rounded-3xl mb-6"><AlertCircle size={32} /></div>
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] mb-4">University Feedback</h3>
                  <p className="text-slate-800 font-bold text-lg max-w-2xl mx-auto leading-relaxed">"Internal assessment scores are verified by the department. If any discrepancy is found, please raise a ticket through the helpdesk immediately."</p>
               </div>
            </div>
          )}

          {user.role === 'student' && activeTab === 'fees' && currentUserData && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Total Course Fee" value={`₹${currentUserData.fees.total.toLocaleString()}`} sub="Annual Billing" icon={CreditCard} color="text-slate-700" bgColor="bg-slate-100" />
                <StatCard label="Paid Amount" value={`₹${currentUserData.fees.paid.toLocaleString()}`} sub="Verified Deposits" icon={CheckCircle} color="text-emerald-600" bgColor="bg-emerald-50" />
                <StatCard label="Outstanding" value={`₹${currentUserData.fees.balance.toLocaleString()}`} sub="Payment Pending" icon={Receipt} color="text-rose-600" bgColor="bg-rose-50" />
              </div>
              <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="font-black text-xl text-slate-800">Fee Payment Statement</h3></div>
                <div className="p-8">
                   <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center gap-6"><div className="p-5 bg-white rounded-2xl shadow-sm text-blue-600 border border-slate-100"><Receipt /></div><div><p className="font-black text-slate-800 text-lg">Academic Year 2026 Tuition</p><p className="text-xs font-bold text-slate-400">REF-ID: EDU_PAY_IN_44902</p></div></div>
                      <div className="text-right"><p className="text-2xl font-black text-slate-800">₹{currentUserData.fees.paid.toLocaleString()}</p><p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mt-1">Status: Success</p></div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 border border-slate-700"><CheckCircle size={22} className="text-emerald-400" /><span className="font-black text-[10px] uppercase tracking-[0.2em]">{showToast}</span></div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-100' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    <Icon size={20} className={active ? "text-white" : "text-slate-300"} />
    <span className="tracking-tight text-xs uppercase tracking-widest">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const StatCard = ({ label, value, sub, icon: Icon, color, bgColor }) => (
  <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{label}</p>
      <p className={`text-4xl font-black ${color} tracking-tighter`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest">{sub}</p>
    </div>
    <div className={`p-6 rounded-3xl ${bgColor} ${color} shadow-inner group-hover:scale-110 transition-transform`}><Icon size={36} /></div>
  </div>
);

const ProfileCard = ({ label, val }) => (
  <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p><p className="text-xl font-black text-slate-800">{val}</p></div>
);

export default App;
