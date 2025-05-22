
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaCalendar, FaClock, FaUserCheck, FaUserTimes, FaExclamationTriangle, FaHome, FaUser } from 'react-icons/fa';

// Status types
type AttendanceStatus = 'Success' | 'Absent' | 'Alert' | 'Weekend' | 'NC';

// Log entry structure
interface LogEntry {
  date: string;
  inTime?: string;
  outTime?: string;
  location?: string;
  status: AttendanceStatus;
}

// Mock data for the attendance logs
const mockLogs: LogEntry[] = [
  { date: '21 May', inTime: '13:58', outTime: 'NA', location: 'Office', status: 'Alert' },
  { date: '20 May', inTime: 'In Time', outTime: 'NA', status: 'Absent' },
  { date: '19 May', inTime: '13:46', outTime: 'NA', location: 'Office', status: 'NC' },
  { date: '18 May', inTime: 'In Time', outTime: 'NA', status: 'Weekend' },
  { date: '17 May', inTime: '15:04', outTime: 'NA', location: 'Office', status: 'NC' },
  { date: '16 May', inTime: '05:42', outTime: 'NA', location: 'Office', status: 'Success' },
];

const AttendanceLog: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('May');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  
  // Count totals
  const totalWorkingDays = 21;
  const successDays = mockLogs.filter(log => log.status === 'Success').length;
  const absentDays = mockLogs.filter(log => log.status === 'Absent').length;
  const alertDays = mockLogs.filter(log => log.status === 'Alert' || log.status === 'NC').length;

  // Status color and icon mapping
  const getStatusStyle = (status: AttendanceStatus) => {
    switch (status) {
      case 'Success':
        return { color: '#4ADE80', icon: <FaUserCheck size={18} className="mr-2" /> };
      case 'Absent':
        return { color: '#F87171', icon: <FaUserTimes size={18} className="mr-2" /> };
      case 'Alert':
      case 'NC':
        return { color: '#FBBF24', icon: <FaExclamationTriangle size={18} className="mr-2" /> };
      case 'Weekend':
        return { color: '#94A3B8', icon: <FaCalendar size={18} className="mr-2" /> };
      default:
        return { color: '#8E9196', icon: <FaCalendar size={18} className="mr-2" /> };
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#00847e] pb-20">
      <div className="bg-white p-4 flex items-center">
        <h1 className="text-2xl text-[#00847e] font-bold mx-auto">Log Entries</h1>
      </div>
      
      <div className="p-4">
        {/* Month and Year Selection */}
        <div className="flex mb-4 gap-4">
          <div className="w-1/2">
            <div className="bg-[#00847e] border-2 border-white p-4 rounded-md">
              <p className="text-white">Month</p>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white font-bold">{selectedMonth}</h2>
                <span className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-1/2">
            <div className="bg-[#00847e] border-2 border-white p-4 rounded-md">
              <p className="text-white">Year</p>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white font-bold">{selectedYear}</h2>
                <span className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary Card */}
        <Card className="mb-4 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-4">
              <div className="col-span-1 bg-[#00847e] p-4 flex flex-col items-center justify-center text-white">
                <FaCalendar size={24} className="mb-2" />
                <h3 className="text-xl font-bold">Total {totalWorkingDays}</h3>
                <p className="text-sm">Working Days</p>
              </div>
              
              <div className="col-span-1 p-4 flex flex-col items-center justify-center">
                <div className="text-[#4ADE80] flex flex-col items-center">
                  <FaUserCheck size={24} className="mb-2" />
                  <h3 className="text-xl font-bold">{successDays}</h3>
                  <p className="text-sm text-black">Success</p>
                </div>
              </div>
              
              <div className="col-span-1 p-4 flex flex-col items-center justify-center">
                <div className="text-[#F87171] flex flex-col items-center">
                  <FaUserTimes size={24} className="mb-2" />
                  <h3 className="text-xl font-bold">{absentDays}</h3>
                  <p className="text-sm text-black">Absent</p>
                </div>
              </div>
              
              <div className="col-span-1 p-4 flex flex-col items-center justify-center">
                <div className="text-[#FBBF24] flex flex-col items-center">
                  <FaExclamationTriangle size={24} className="mb-2" />
                  <h3 className="text-xl font-bold">{alertDays}</h3>
                  <p className="text-sm text-black">Alert</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Log Entries */}
        {mockLogs.map((log, index) => {
          const statusStyle = getStatusStyle(log.status);
          
          return (
            <Card key={index} className="mb-4 rounded-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <h3 className="text-xl font-bold">{log.date}</h3>
                      {log.location && (
                        <div className="flex items-center text-green-500 mt-1">
                          <span className="inline-block w-4 h-4 mr-1 rounded-full bg-green-500"></span>
                          <span>{log.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex flex-col items-center mr-8">
                      <span className="text-gray-500 text-sm">
                        {log.inTime === 'In Time' ? 'NA' : log.inTime}
                      </span>
                      <div className={`rounded-full px-4 py-1 mt-1 bg-green-500 text-white flex items-center`}>
                        <FaClock className="mr-1" size={14} />
                        In Time
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center mr-8">
                      <span className="text-gray-500 text-sm">{log.outTime}</span>
                      <div className="rounded-full px-4 py-1 mt-1 bg-gray-300 text-gray-700 flex items-center">
                        <FaClock className="mr-1" size={14} />
                        Out Time
                      </div>
                    </div>
                    
                    <div className="flex items-center" style={{ color: statusStyle.color }}>
                      {statusStyle.icon}
                      <span>{log.status}</span>
                    </div>
                    
                    <div className="ml-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon text-green-500"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <div className="flex flex-col items-center text-[#00847e]">
          <FaHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <FaCalendar size={24} />
          <span className="text-xs mt-1">Log</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <FaUser size={24} />
          <span className="text-xs mt-1">Profile</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <FaUser size={24} />
          <span className="text-xs mt-1">My Account</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog;
