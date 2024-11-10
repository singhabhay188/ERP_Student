'use client'
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { TIME_SLOTS, WORKING_DAYS } from '@/utils/const'
import { Group, Subject } from '@/utils/types'


const createDateTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(num => parseInt(num))
  const date = new Date(2000, 0, 1)
  date.setHours(hours, minutes, 0, 0)
  return date
}

const convertToIST = (utcDateString: string) => {
  const utcDate = new Date(utcDateString);
  return utcDate;
};

const TimetablePage = () => {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [groups, setGroups] = useState<Group[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [timetableData, setTimetableData] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Fetch groups and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, subjectsRes] = await Promise.all([
          fetch('/api/groups'),
          fetch('/api/subjects')
        ]);
        
        const groupsData = await groupsRes.json()
        const subjectsData = await subjectsRes.json()
        
        setGroups(groupsData)
        setSubjects(subjectsData)
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch timetable when group is selected
  useEffect(() => {
    if (!selectedGroup) {
      setTimetableData({})
      return
    }

    setLoading(true)
    const fetchTimetable = async () => {
      try {
        const res = await fetch(`/api/timetable?groupId=${selectedGroup}`)
        const data = await res.json();
        
        console.log('Raw data from API:', data);
        
        setTimetableData({})
        
        if (data?.class) {
          const formattedData: Record<string, Record<string, string>> = {}
          
          data.class.forEach((cls: any) => {
            // Convert UTC to IST by adding 5 hours and 30 minutes
            const startDate = new Date(cls.startTime);
            const endDate = new Date(cls.endTime);
            
            startDate.setHours(startDate.getUTCHours() + 5);
            startDate.setMinutes(startDate.getUTCMinutes() + 30);
            endDate.setHours(endDate.getUTCHours() + 5);
            endDate.setMinutes(endDate.getUTCMinutes() + 30);

            // Format times to match TIME_SLOTS exactly
            const startHour = startDate.getHours();
            const endHour = endDate.getHours();
            
            // const startTime = `${startHour > 12 ? startHour - 12 : startHour}:${startDate.getMinutes().toString().padStart(2, '0')}`;
            // const endTime = `${endHour > 12 ? endHour - 12 : endHour}:${endDate.getMinutes().toString().padStart(2, '0')}`;

            const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
            const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

            const timeKey = `${startTime}-${endTime}`;
            
            if (!formattedData[timeKey]) {
              formattedData[timeKey] = {}
            }
            formattedData[timeKey][cls.day] = cls.subject.id
          })
          
          setTimetableData(formattedData)
        }
      } catch (error) {
        toast.error('Failed to fetch timetable')
      } finally {
        setLoading(false)
      }
    }

    fetchTimetable()
  }, [selectedGroup])

  const handleSave = async () => {
    if (!selectedGroup) {
      toast.error('Please select a group')
      return
    }

    setLoading(true)
    try {
      const classes = []
      
      for (const slot of TIME_SLOTS) {
        const timeKey = `${slot.start}-${slot.end}`
        for (const day of WORKING_DAYS) {
          const subjectId = timetableData[timeKey]?.[day]
          if (subjectId) {
            classes.push({
              day,
              startTime: createDateTime(slot.start),
              endTime: createDateTime(slot.end),
              subjectId
            })
          }
        }
      }

      await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ groupId: selectedGroup, classes })
      });

      toast.success('Timetable saved successfully');
    } catch (error) {
      toast.error('Failed to save timetable');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Toaster />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 bg-white" />
        </div>
      )}
      {initialLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Timetable Management</h1>
          
          {/* Group Selection */}
          <div className="mb-6">
            <select 
              className="border p-2 rounded w-[300px]"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.section.year.course.name} - {group.section.year.course.subname || ''} - Year {group.section.year.semNum} - {group.section.name} - {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timetable Grid */}
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Time</th>
                  {WORKING_DAYS.map((day) => (
                    <th key={day} className="border p-2">
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      {`${slot.start} - ${slot.end}`}
                    </td>
                    {WORKING_DAYS.map((day) => (
                      <td key={day} className="border p-2">
                        <select
                          className="w-full border p-1 rounded"
                          value={timetableData[`${slot.start}-${slot.end}`]?.[day] || ''}
                          onChange={(e) => {
                            const timeKey = `${slot.start}-${slot.end}`
                            setTimetableData(prev => ({
                              ...prev,
                              [timeKey]: {
                                ...prev[timeKey],
                                [day]: e.target.value
                              }
                            }))
                          }}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.code} - {subject.title}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleSave}
              disabled={loading || !selectedGroup}
            >
              {loading ? 'Saving...' : 'Save Timetable'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TimetablePage