import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, UserCircle, BookOpen, Users, 
  CheckCircle, GraduationCap, Clock, Calendar, 
  Save, ChevronRight, LogOut, UserPlus, FileEdit,
  ShieldCheck, LogIn, ClipboardList, PlusCircle,
  CreditCard, Receipt, AlertCircle
} from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('overview');
  const [role, setRole] = useState('student'); 
  const [db, setDb] = useState({ users: [], students: [], teachers: [] });
  const [showToast, setShowToast] = useState("");

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

  // Database Initialization with Rupee values and Full Week Schedule
  useEffect(() => {
    const savedData = localStorage.getItem('eduportal_master_db');
    if (savedData) {
      setDb(JSON.parse(savedData));
    } else {
      const mockStudents = [
        { id: "S101", name: "Rahul Kumar", marks: { Math: 85, Science: 78, CS: 92 }, attendance: 88, fees: { total: 125000, paid: 85000, balance: 40000 }, attendanceLog: [{ month: "JAN", value: 80 }, { month: "FEB", value: 85 }, { month: "MAR", value: 90 }, { month: "APR", value: 88 }] },
        { id: "S102", name: "Priya Sharma", marks: { Math: 72, Science: 90, CS: 85 }, attendance: 92, fees: { total: 125000, paid: 125000, balance: 0 }, attendanceLog: [{ month: "JAN", value: 90 }, { month: "FEB", value: 92 }, { month: "MAR", value: 95 }, { month: "APR", value: 92 }] },
        { id: "S103", name: "Amit Singh", marks: { Math: 65, Science: 70, CS: 80 }, attendance: 75, fees: { total: 125000, paid: 45000, balance: 80000 }, attendanceLog: [{ month: "JAN", value: 70 }, { month: "FEB", value: 75 }, { month: "MAR", value: 72 }, { month: "APR", value: 75 }] },
        { id: "S104", name: "Sanya Roy", marks: { Math: 95, Science: 98, CS: 99 }, attendance: 98, fees: { total: 125000, paid: 125000, balance: 0 }, attendanceLog: [{ month: "JAN", value: 98 }, { month: "FEB", value: 98 }, { month: "MAR", value: 100 }, { month: "APR", value: 98 }] },
        { id: "S105", name: "Vikram Aditya", marks: { Math: 80, Science: 82, CS: 88 }, attendance: 85, fees: { total: 125000, paid: 90000, balance: 35000 }, attendanceLog: [{ month: "JAN", value: 80 }, { month: "FEB", value: 82 }, { month: "MAR", value: 85 }, { month: "APR", value: 85 }] },
        { id: "S106", name: "Anjali Verma", marks: { Math: 70, Science: 65, CS: 75 }, attendance: 80, fees: { total: 125000, paid: 125000, balance: 0 }, attendanceLog: [{ month: "JAN", value: 75 }, { month: "FEB", value: 78 }, { month: "MAR", value: 80 }, { month: "APR", value: 80 }] },
        { id: "S107", name: "Arjun Mehra", marks: { Math: 88, Science: 85, CS: 90 }, attendance: 90, fees: { total: 125000, paid: 110000, balance: 15000 }, attendanceLog: [{ month: "JAN", value: 85 }, { month: "FEB", value: 88 }, { month: "MAR", value: 92 }, { month: "APR", value: 90 }] },
        { id: "S108", name: "Ishani Gupta", marks: { Math: 78, Science: 80, CS: 82 }, attendance: 82, fees: { total: 125000, paid: 60000, balance: 65000 }, attendanceLog: [{ month: "JAN", value: 78 }, { month: "FEB", value: 80 }, { month: "MAR", value: 82 }, { month: "APR", value: 82 }] },
        { id: "S109", name: "Rohan Das", marks: { Math: 92, Science: 88, CS: 95 }, attendance: 95, fees: { total: 125000, paid: 125000, balance: 0 }, attendanceLog: [{ month: "JAN", value: 92 }, { month: "FEB", value: 95 }, { month: "MAR", value: 98 }, { month: "APR", value: 95 }] },
        { id: "S110", name: "Kavya Iyer", marks: { Math: 84, Science: 86, CS: 88 }, attendance: 86, fees: { total: 125000, paid: 95000, balance: 30000 }, attendanceLog: [{ month: "JAN", value: 84 }, { month: "FEB", value: 85 }, { month: "MAR", value: 88 }, { month: "APR", value: 86 }] }
      ];

      const initialDb = {
        users: [
          { id: "admin", password: "123", name: "Prof. Rajesh Sharma", role: "teacher" },
          { id: "S101", password: "123", name: "Rahul Kumar", role: "student" }
        ],
        students: mockStudents,
        teachers: [
          { 
            id: "admin", 
            name: "Prof. Rajesh Sharma", 
            department: "AI & Data Science",
            schedule: [
              { day: "Monday", time: "10:00 AM", class: "B.Tech CS-4A", room: "302" },
              { day: "Tuesday", time: "11:30 AM", class: "B.Tech AI-1A", room: "101" },
              { day: "Wednesday", time: "02:00 PM", class: "B.Tech AI-2B", room: "Lab 5" },
              { day: "Thursday", time: "10:00 AM", class: "B.Tech CS-4A", room: "302" },
              { day: "Friday", time: "11:00 AM", class: "B.Tech CS-3C", room: "401" },
              { day: "Saturday", time: "09:30 AM", class: "Data Science Seminar", room: "Audi-1" }
            ]
          }
        ]
      };
      localStorage.setItem('eduportal_master_db', JSON.stringify(initialDb));
      setDb(initialDb);
    }
  }, []);

  const saveToDb = (newDb) => {
    setDb(newDb);
    localStorage.setItem('eduportal_master_db', JSON.stringify(newDb));
  };

  const notify = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleAuth = (e, type) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userId = data.get('userId');
    const password = data.get('password');
    const name = data.get('name');

    if (type === 'signup') {
      if (db.users.find(u => u.id === userId)) return notify("User ID already exists!");
      
      const newUser = { id: userId, password, name, role };
      const updatedUsers = [...db.users, newUser];
      const newDb = { ...db, users: updatedUsers };
      
      if (role === 'teacher') {
        newDb.teachers.push({ 
          id: userId, 
          name, 
          department: "AI & Data Science",
          schedule: [{ day: "Monday", time: "09:00 AM", class: "Intro to Computing", room: "Lab 1" }]
        });
      } else {
        newDb.students.push({ 
          id: userId, 
          name, 
          marks: { Math: 0, Science: 0, CS: 0 }, 
          attendance: 0,
          fees: { total: 125000, paid: 0, balance: 125000 },
          attendanceLog: [{ month: "JAN", value: 0 }, { month: "FEB", value: 0 }, { month: "MAR", value: 0 }, { month: "APR", value: 0 }]
        });
      }

      saveToDb(newDb);
      notify("Registration Successful!");
      setView('login');
    } else {
      const foundUser = db.users.find(u => u.id === userId && u.password === password && u.role === role);
      if (foundUser) {
        setUser(foundUser);
        setView('dashboard');
        notify(`Welcome back, ${foundUser.name}`);
      } else {
        notify("Invalid Credentials!");
      }
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const sId = data.get('sId');
    const sName = data.get('sName');

    if (db.students.find(s => s.id === sId)) return notify("Student ID already exists!");

    const newStudent = { 
      id: sId, 
      name: sName, 
      marks: { Math: 0, Science: 0, CS: 0 }, 
      attendance: parseInt(data.get('sAtt')) || 0,
      fees: { total: 125000, paid: 0, balance: 125000 },
      attendanceLog: [{ month: "JAN", value: 60 }, { month: "FEB", value: 70 }, { month: "MAR", value: 80 }, { month: "APR", value: 85 }]
    };

    saveToDb({ ...db, students: [...db.students, newStudent] });
    notify("Student added successfully!");
    e.target.reset();
  };

  const updateMarks = (sId, subject, val) => {
    const updatedStudents = db.students.map(s => {
      if (s.id === sId) {
        return { ...s, marks: { ...s.marks, [subject]: parseInt(val) || 0 } };
      }
      return s;
    });
    saveToDb({ ...db, students: updatedStudents });
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
            </>
          ) : (
            <>
              <SidebarLink icon={BookOpen} label="My Progress" active={activeTab === 'academics'} onClick={() => setActiveTab('academics')} />
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