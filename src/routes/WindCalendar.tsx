import React, { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "../components/Button";
import { useGetCalendarEvent } from "../queries/CalenarQuery";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import EventList from "../components/EventsList";
import { EventApi } from "@fullcalendar/core";
import "../App";
import NoteHeader from "../components/NoteHeader";

import { CalendarType } from "../types/Calendar";
import StyleWrapper from "../components/StyleWrapper";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
import "../components/CalendarStyles.css";

const WindCalendar = () => {

  const { data: calendarEvents } = useGetCalendarEvent();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = format(selectedDate, "MM月dd日", { locale: ja });

  // Filter states
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CalendarType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get unique workers from calendar events
  const uniqueWorkers = useMemo(() => {
    if (!calendarEvents) return [];
    const workers = new Set<string>();
    calendarEvents.forEach((event: CalendarType) => {
      if (event.user?.user_profile?.name) {
        workers.add(event.user.user_profile.name);
      }
    });
    return Array.from(workers).sort();
  }, [calendarEvents]);

  // Get unique participants from calendar events (including workers array)
  const uniqueParticipants = useMemo(() => {
    if (!calendarEvents) return [];
    const participants = new Set<string>();
    
    calendarEvents.forEach((event: CalendarType) => {
      // Add main user if they have a name
      if (event.user?.user_profile?.name) {
        participants.add(event.user.user_profile.name);
      }
      
      // Add workers from the workers array
      if (event.workers && Array.isArray(event.workers)) {
        event.workers.forEach((worker: string) => {
          if (worker && worker.trim()) {
            participants.add(worker.trim());
          }
        });
      }
    });
    
    return Array.from(participants).sort();
  }, [calendarEvents]);

  // Get unique days of the week from calendar events
  const uniqueDays = useMemo(() => {
    if (!calendarEvents) return [];
    const days = new Set<string>();
    calendarEvents.forEach((event: CalendarType) => {
      const eventDate = new Date(event.start);
      const dayName = format(eventDate, 'EEEE', { locale: ja });
      days.add(dayName);
    });
    return Array.from(days).sort();
  }, [calendarEvents]);

  // Get unique statuses from calendar events
  const uniqueStatuses = useMemo(() => {
    if (!calendarEvents) return [];
    const statuses = new Set<string>();
    calendarEvents.forEach((event: CalendarType) => {
      const status = event.status || "未開始";
      statuses.add(status);
    });
    return Array.from(statuses).sort();
  }, [calendarEvents]);

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim() || !calendarEvents) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchTerm = query.toLowerCase().trim();
    
    const results = calendarEvents.filter((event: CalendarType) => {
      // Search in worker name
      const workerName = event.user?.user_profile?.name?.toLowerCase() || "";
      if (workerName.includes(searchTerm)) return true;
      
      // Search in workers array
      if (event.workers && Array.isArray(event.workers)) {
        const hasWorkerMatch = event.workers.some((worker: string) => 
          worker.toLowerCase().includes(searchTerm)
        );
        if (hasWorkerMatch) return true;
      }
      
      // Search in vehicle info and repair type
      const vehicleInfo = event.vehicle_info?.toLowerCase() || "";
      const repairType = event.repair_type?.toLowerCase() || "";
      if (vehicleInfo.includes(searchTerm) || repairType.includes(searchTerm)) return true;
      
      // Search in description
      const description = event.description?.toLowerCase() || "";
      if (description.includes(searchTerm)) return true;
      
      // Search in status
      const status = event.status || "未開始";
      if (status.toLowerCase().includes(searchTerm)) return true;
      
      // Search in date (format: YYYY-MM-DD)
      const startDate = format(new Date(event.start), 'yyyy-MM-dd');
      const endDate = format(new Date(event.end), 'yyyy-MM-dd');
      if (startDate.includes(searchTerm) || endDate.includes(searchTerm)) return true;
      
      // Search in Japanese day names
      const eventDate = new Date(event.start);
      const dayName = format(eventDate, 'EEEE', { locale: ja });
      if (dayName.toLowerCase().includes(searchTerm)) return true;
      
      return false;
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, calendarEvents]);

  // Helper function to check if an event has any of the selected participants
  const eventHasSelectedParticipants = (event: CalendarType) => {
    if (selectedParticipants.length === 0) return true;
    
    const eventParticipants = new Set<string>();
    
    // Add main user
    if (event.user?.user_profile?.name) {
      eventParticipants.add(event.user.user_profile.name);
    }
    
    // Add workers from workers array
    if (event.workers && Array.isArray(event.workers)) {
      event.workers.forEach((worker: string) => {
        if (worker && worker.trim()) {
          eventParticipants.add(worker.trim());
        }
      });
    }
    
    // Check if any selected participant is in the event
    return selectedParticipants.some(participant => 
      eventParticipants.has(participant)
    );
  };

  // Filter events based on selected workers, days, statuses, and participants
  const filteredEvents = useMemo(() => {
    if (!calendarEvents) return [];
    
    return calendarEvents.filter((event: CalendarType) => {
      // Filter by workers (legacy filter - keep for backward compatibility)
      if (selectedWorkers.length > 0) {
        const workerName = event.user?.user_profile?.name;
        if (!workerName || !selectedWorkers.includes(workerName)) {
          return false;
        }
      }
      
      // Filter by participants (new filter)
      if (!eventHasSelectedParticipants(event)) {
        return false;
      }
      
      // Filter by days
      if (selectedDays.length > 0) {
        const eventDate = new Date(event.start);
        const dayName = format(eventDate, 'EEEE', { locale: ja });
        if (!selectedDays.includes(dayName)) {
          return false;
        }
      }

      // Filter by statuses
      if (selectedStatuses.length > 0) {
        const status = event.status || "未開始";
        if (!selectedStatuses.includes(status)) {
          return false;
        }
      }
      
      return true;
    });
  }, [calendarEvents, selectedWorkers, selectedDays, selectedStatuses, selectedParticipants]);

  // Combine search results with filters
  const finalFilteredEvents = useMemo(() => {
    if (searchQuery.trim()) {
      // If searching, apply filters to search results
      return searchResults.filter((event: CalendarType) => {
        // Filter by workers (legacy filter)
        if (selectedWorkers.length > 0) {
          const workerName = event.user?.user_profile?.name;
          if (!workerName || !selectedWorkers.includes(workerName)) {
            return false;
          }
        }
        
        // Filter by participants (new filter)
        if (!eventHasSelectedParticipants(event)) {
          return false;
        }
        
        // Filter by days
        if (selectedDays.length > 0) {
          const eventDate = new Date(event.start);
          const dayName = format(eventDate, 'EEEE', { locale: ja });
          if (!selectedDays.includes(dayName)) {
            return false;
          }
        }

        // Filter by statuses
        if (selectedStatuses.length > 0) {
          const status = event.status || "未開始";
          if (!selectedStatuses.includes(status)) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // If not searching, use regular filtered events
    return filteredEvents;
  }, [searchQuery, searchResults, filteredEvents, selectedWorkers, selectedDays, selectedStatuses, selectedParticipants]);

  // 今日の日付に対応するイベントをフィルタリング
  const eventsOnSelectedDate = finalFilteredEvents?.filter((event: CalendarType) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const todayStart = new Date(selectedDate);
    const todayEnd = new Date(selectedDate);

    // set the time to the start of the day for accurate comparison
    todayStart.setHours(0, 0, 0, 0);
    todayEnd.setHours(23, 59, 59, 999);

    // イベントの終了日を調整
    eventEnd.setDate(eventEnd.getDate() - 1);

    // Check if the event is on the selected date
    return (
      (eventStart >= todayStart && eventStart <= todayEnd) ||
      (eventEnd >= todayStart && eventEnd <= todayEnd) ||
      (eventStart <= todayStart && eventEnd >= todayEnd)
    );
  });

  const eventClassNames = ({ event }: { event: EventApi }) => {
    const classes = [];
    
    if (event.extendedProps.is_absent) {
      classes.push("is-absent");
    }
    
    // Add status-based classes
    if (event.extendedProps.status) {
      classes.push(`status-${event.extendedProps.status}`);
    }
    
    // Add delayed class for styling
    if (event.extendedProps.is_delayed) {
      classes.push("is-delayed");
    }
    
    return classes;
  };

  const formattedEvents = useMemo(() => {
    if (!finalFilteredEvents) return [];

    return finalFilteredEvents.map((event: CalendarType) => {
      const status = event.status || "未開始";
      const eventIsDelayed = event.is_delayed || false;
      
      // Add delayed indicator if event is delayed
      let displayTitle = event.vehicle_info || event.repair_type || "スケジュール";
      if (eventIsDelayed) {
        displayTitle = `${displayTitle} ⇒`;
      }
      
      return {
        ...event,
        id: event.id.toString(),
        title: displayTitle,
        end: new Date(new Date(event.end).setDate(new Date(event.end).getDate()))
          .toISOString()
          .split("T")[0],
        extendedProps: {
          is_absent: event.is_absent,
          status: status,
          is_delayed: eventIsDelayed,
        },
      };
    });
  }, [finalFilteredEvents]);

  // Handle worker filter toggle
  const toggleWorkerFilter = (workerName: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerName) 
        ? prev.filter(name => name !== workerName)
        : [...prev, workerName]
    );
  };

  // Handle participant filter toggle
  const toggleParticipantFilter = (participantName: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantName) 
        ? prev.filter(name => name !== participantName)
        : [...prev, participantName]
    );
  };

  // Handle day filter toggle
  const toggleDayFilter = (dayName: string) => {
    setSelectedDays(prev => 
      prev.includes(dayName) 
        ? prev.filter(name => name !== dayName)
        : [...prev, dayName]
    );
  };

  // Handle status filter toggle
  const toggleStatusFilter = (statusName: string) => {
    setSelectedStatuses(prev => 
      prev.includes(statusName) 
        ? prev.filter(name => name !== statusName)
        : [...prev, statusName]
    );
  };

  // Clear all filters and search
  const clearAll = () => {
    setSelectedWorkers([]);
    setSelectedDays([]);
    setSelectedStatuses([]);
    setSelectedParticipants([]);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Layout>
      <RequireAuth>
        <div className="flex flex-col min-h-screen relative w-full">
          <NoteHeader />
          <div className="flex-grow overflow-y-auto px-3">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="作業員、参加者、車両情報、説明、ステータス、日付、曜日で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Search Results Summary */}
                {searchQuery && (
                  <div className="mt-3 text-sm text-gray-600">
                    {isSearching ? (
                      <span>検索中...</span>
                    ) : (
                      <span>
                        検索結果: {searchResults.length}件
                        {searchResults.length > 0 && (
                          <span className="ml-2 text-blue-600">
                            (フィルター適用後: {finalFilteredEvents.length}件)
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">フィルター</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      className="text-sm px-3 py-1"
                      text={showFilters ? "フィルターを隠す" : "フィルターを表示"}
                    />
                    {(selectedWorkers.length > 0 || selectedParticipants.length > 0 || selectedDays.length > 0 || selectedStatuses.length > 0 || searchQuery) && (
                      <Button
                        onClick={clearAll}
                        className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white"
                        text="すべてクリア"
                      />
                    )}
                  </div>
                </div>
                
                {showFilters && (
                  <div className="space-y-4">
                    {/* Worker Filter (Legacy - keep for backward compatibility) */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">作業員 (メイン)</h4>
                      <div className="flex flex-wrap gap-2">
                        {uniqueWorkers.map((worker) => (
                          <button
                            key={worker}
                            onClick={() => toggleWorkerFilter(worker)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              selectedWorkers.includes(worker)
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                            }`}
                          >
                            {worker}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Participant Filter (New) */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">参加者 (全員)</h4>
                      <div className="flex flex-wrap gap-2">
                        {uniqueParticipants.map((participant) => (
                          <button
                            key={participant}
                            onClick={() => toggleParticipantFilter(participant)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              selectedParticipants.includes(participant)
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
                            }`}
                          >
                            {participant}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Day Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">曜日</h4>
                      <div className="flex flex-wrap gap-2">
                        {uniqueDays.map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleDayFilter(day)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              selectedDays.includes(day)
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-700 border-gray-300 hover:border-green-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ステータス</h4>
                      <div className="flex flex-wrap gap-2">
                        {uniqueStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => toggleStatusFilter(status)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              selectedStatuses.includes(status)
                                ? "bg-purple-500 text-white border-purple-500"
                                : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Summary and Clear Button */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        {selectedWorkers.length > 0 && (
                          <span className="mr-3">
                            作業員: {selectedWorkers.join(", ")}
                          </span>
                        )}
                        {selectedParticipants.length > 0 && (
                          <span className="mr-3">
                            参加者: {selectedParticipants.join(", ")}
                          </span>
                        )}
                        {selectedDays.length > 0 && (
                          <span className="mr-3">
                            曜日: {selectedDays.join(", ")}
                          </span>
                        )}
                        {selectedStatuses.length > 0 && (
                          <span>
                            ステータス: {selectedStatuses.join(", ")}
                          </span>
                        )}
                        {selectedWorkers.length === 0 && selectedParticipants.length === 0 && selectedDays.length === 0 && selectedStatuses.length === 0 && !searchQuery && (
                          <span>フィルターなし</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 z-0">
              <StyleWrapper>
                <div className="calendar-container">
                  <FullCalendar
                    headerToolbar={{
                      start: "prev",
                      center: "title",
                      end: "next",
                    }}
                    height="60vh"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    selectable={true}
                    locale="ja"
                    events={formattedEvents}
                    businessHours={true}
                    displayEventTime={false}
                    dateClick={(info) => setSelectedDate(new Date(info.date))}
                    eventClassNames={eventClassNames}
                    dayCellClassNames={({ date }) => {
                      const classes = [];
                      const today = new Date();
                      const isToday = date.toDateString() === today.toDateString();
                      const isSunday = date.getDay() === 0;
                      
                      if (isToday) {
                        classes.push('fc-today-highlight');
                      }
                      if (isSunday) {
                        classes.push('fc-sunday-highlight');
                      }
                      
                      return classes;
                    }}
                    dayHeaderClassNames={({ date }) => {
                      const isSunday = date.getDay() === 0;
                      return isSunday ? ['fc-sunday-header'] : [];
                    }}
                  />
                </div>
                

              </StyleWrapper>
            </div>
            <EventList events={eventsOnSelectedDate || []} date={today} />
          </div>
        </div>
      </RequireAuth>
    </Layout>
  );
};

export default WindCalendar;
