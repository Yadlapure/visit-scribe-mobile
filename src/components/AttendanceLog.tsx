
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Check, AlertCircle, X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { FaHome, FaCalendar, FaUser } from 'react-icons/fa';

// Status types
type AttendanceStatus = 'Success' | 'Absent' | 'Alert' | 'Weekend' | 'NC';

// Log entry structure
interface LogEntry {
  id: string;
  date: string;
  inTime?: string;
  outTime?: string;
  location?: string;
  status: AttendanceStatus;
  reason?: string;
}

// Mock data for the attendance logs
const initialMockLogs: LogEntry[] = [
  { id: '1', date: '21 May', inTime: '13:58', outTime: undefined, location: 'Office', status: 'Alert' },
  { id: '2', date: '20 May', inTime: undefined, outTime: undefined, status: 'Absent' },
  { id: '3', date: '19 May', inTime: '13:46', outTime: '17:30', location: 'Office', status: 'Success' },
  { id: '4', date: '18 May', inTime: undefined, outTime: undefined, status: 'Weekend' },
  { id: '5', date: '17 May', inTime: '15:04', outTime: '18:45', location: 'Office', status: 'Success' },
  { id: '6', date: '16 May', inTime: '05:42', outTime: '14:30', location: 'Office', status: 'Success' },
];

const AttendanceLog: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('May');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>(initialMockLogs);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState<string>('');

  // Count totals
  const totalWorkingDays = 21;
  const successDays = logs.filter(log => log.status === 'Success').length;
  const absentDays = logs.filter(log => log.status === 'Absent').length;
  const alertDays = logs.filter(log => log.status === 'Alert' || log.status === 'NC').length;

  // Open the dialog to add a reason
  const openReasonDialog = (logId: string) => {
    const log = logs.find(log => log.id === logId);
    setSelectedLogId(logId);
    setReasonText(log?.reason || '');
    setIsDialogOpen(true);
  };

  // Save the reason
  const saveReason = () => {
    if (selectedLogId) {
      setLogs(prevLogs => prevLogs.map(log => 
        log.id === selectedLogId ? { ...log, reason: reasonText } : log
      ));
      setIsDialogOpen(false);
      setSelectedLogId(null);
      setReasonText('');
    }
  };

  // Handle date change in the calendar
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSelectedMonth(format(date, 'MMMM'));
      setSelectedYear(format(date, 'yyyy'));
      setIsCalendarOpen(false);
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: AttendanceStatus, hasOutTime: boolean) => {
    switch (status) {
      case 'Success':
        return { 
          color: '#4ADE80', 
          icon: <Check size={18} className="mr-2" />
        };
      case 'Absent':
        return { 
          color: '#F87171', 
          icon: <X size={18} className="mr-2" /> 
        };
      case 'Alert':
      case 'NC':
        return { 
          color: '#FBBF24', 
          icon: <AlertCircle size={18} className="mr-2" /> 
        };
      case 'Weekend':
        return { 
          color: '#94A3B8', 
          icon: <CalendarIcon size={18} className="mr-2" /> 
        };
      default:
        return { 
          color: '#8E9196', 
          icon: <CalendarIcon size={18} className="mr-2" /> 
        };
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <div className="bg-white p-4 flex items-center border-b">
        <h1 className="text-2xl text-[#00847e] font-bold mx-auto">Log Entries</h1>
      </div>
      
      <div className="p-4">
        {/* Month and Year Selection with Calendar */}
        <div className="mb-4">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full border-2 border-[#00847e] bg-white text-[#00847e] p-4 flex justify-between items-center">
                <span className="flex flex-col items-start">
                  <span className="text-sm">Month & Year</span>
                  <span className="text-xl font-bold">{selectedMonth} {selectedYear}</span>
                </span>
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Summary Card */}
        <Card className="mb-4 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-4">
              <div className="col-span-1 bg-[#00847e] p-4 flex flex-col items-center justify-center text-white">
                <CalendarIcon size={24} className="mb-2" />
                <h3 className="text-xl font-bold">Total {totalWorkingDays}</h3>
                <p className="text-sm">Working Days</p>
              </div>
              
              <div className="col-span-1 p-4 flex flex-col items-center justify-center">
                <div className="text-[#4ADE80] flex flex-col items-center">
                  <Check size={24} className="mb-2" />
                  <h3 className="text-xl font-bold">{successDays}</h3>
                  <p className="text-sm text-black">Success</p>
                </div>
              </div>
              
              <div className="col-span-1 p-4 flex flex-col items-center justify-center">
                <div className="text-[#F87171] flex flex-col items-center">
                  <X size={24} className="mb-2" />
                  <h3 className="text-xl font-bold">{absentDays}</h3>
                  <p className="text-sm text-black">Absent</p>
                </div>
              </div>
              
              <div className="col-span-1 p-4 flex flex-col items-center justify-center">
                <div className="text-[#FBBF24] flex flex-col items-center">
                  <AlertCircle size={24} className="mb-2" />
                  <h3 className="text-xl font-bold">{alertDays}</h3>
                  <p className="text-sm text-black">Alert</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Log Entries */}
        {logs.map((log) => {
          const { color, icon } = getStatusInfo(log.status, !!log.outTime);
          
          return (
            <Card key={log.id} className="mb-4 rounded-lg">
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
                      {log.reason && (
                        <div className="text-gray-500 mt-1 text-sm">
                          <span className="font-medium">Reason: </span>
                          {log.reason}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex flex-col items-center mr-8">
                      <span className="text-gray-500 text-sm">
                        {log.inTime || 'NA'}
                      </span>
                      <div className={`rounded-full px-4 py-1 mt-1 ${log.inTime ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'} flex items-center`}>
                        <Clock className="mr-1" size={14} />
                        In Time
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center mr-8">
                      <span className="text-gray-500 text-sm">{log.outTime || 'NA'}</span>
                      <div className={`rounded-full px-4 py-1 mt-1 ${log.outTime ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'} flex items-center`}>
                        <Clock className="mr-1" size={14} />
                        Out Time
                      </div>
                    </div>
                    
                    <div className="flex items-center" style={{ color }}>
                      {icon}
                      <span>{log.status}</span>
                    </div>
                    
                    <div className="ml-4">
                      <Button variant="ghost" size="icon" onClick={() => openReasonDialog(log.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00847e]">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Reason Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reason</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Enter reason for absence or missed check-out..." 
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveReason}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
