import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import EditCalendarEventModal from "../components/EditCalendarEventModal";
import CreateCalendarEvent from "../components/CreateCalendarEvent";

import { CalendarType } from "../types/Calendar";
import StyleWrapper from "../components/StyleWrapper";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
import "../components/CalendarStyles.css";
import { Dialog, DialogContent } from "../@/components/ui/dialog";

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

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarType | null>(null);

  // Create modal state (open when clicking a date)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDate, setCreateDate] = useState<string>("");

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
  const performSearch = useCallback((query: string) => {
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
  }, [calendarEvents]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, calendarEvents, performSearch]);

  // Helper function to check if an event has any of the selected participants
  const eventHasSelectedParticipants = useCallback((event: CalendarType) => {
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
  }, [selectedParticipants]);

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
  }, [calendarEvents, selectedWorkers, selectedDays, selectedStatuses, eventHasSelectedParticipants]);

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
  }, [searchQuery, searchResults, filteredEvents, selectedWorkers, selectedDays, selectedStatuses, eventHasSelectedParticipants]);

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
    
    // Add time period classes for morning/afternoon distinction
    if (event.extendedProps.time_period === "午前") {
      classes.push("time-period-morning");
    } else if (event.extendedProps.time_period === "午後") {
      classes.push("time-period-afternoon");
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
      
      // Build display title without time period (we'll add it with color in eventContent)
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
          time_period: event.time_period,
          vehicle_info: event.vehicle_info,
          repair_type: event.repair_type,
        },
      };
    });
  }, [finalFilteredEvents]);

  // Custom event content renderer with colored text for time period and scrolling for long titles
  const renderEventContent = (eventInfo: any) => {
    const timePeriod = eventInfo.event.extendedProps?.time_period;
    const title = eventInfo.event.title || "";
    
    if (timePeriod === "午前") {
      return (
        <div className="fc-event-title-wrapper">
          <div className="fc-event-title-scroll">
            <span className="fc-event-time-period" style={{ color: '#d97706', fontWeight: 700 }}>午前 </span>
            <span className="fc-event-title-text">{title}</span>
          </div>
        </div>
      );
    } else if (timePeriod === "午後") {
      return (
        <div className="fc-event-title-wrapper">
          <div className="fc-event-title-scroll">
            <span className="fc-event-time-period" style={{ color: '#ea580c', fontWeight: 700 }}>午後 </span>
            <span className="fc-event-title-text">{title}</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fc-event-title-wrapper">
        <div className="fc-event-title-scroll">
          <span className="fc-event-title-text">{title}</span>
        </div>
      </div>
    );
  };

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

  // Handle event click to open edit modal
  const handleEventClick = (clickInfo: any) => {
    const eventId = parseInt(clickInfo.event.id);
    const event = calendarEvents?.find((e: CalendarType) => e.id === eventId);
    
    if (event) {
      setSelectedEvent(event);
      setIsEditModalOpen(true);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Layout>
      <RequireAuth>
        <div className="flex flex-col min-h-screen relative w-full">
          <NoteHeader />
          <div className="flex-grow overflow-y-auto px-2 sm:px-3">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="作業員、参加者、車両情報、説明、ステータス、日付、曜日で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
              <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">フィルター</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1"
                      text={showFilters ? "フィルターを隠す" : "フィルターを表示"}
                    />
                    {(selectedWorkers.length > 0 || selectedParticipants.length > 0 || selectedDays.length > 0 || selectedStatuses.length > 0 || searchQuery) && (
                      <Button
                        onClick={clearAll}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white"
                        text="すべてクリア"
                      />
                    )}
                  </div>
                </div>
                
                {showFilters && (
                  <div className="space-y-4">
                    {/* Worker Filter (Legacy - keep for backward compatibility) */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">作業員 (メイン)</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {uniqueWorkers.map((worker) => (
                          <button
                            key={worker}
                            onClick={() => toggleWorkerFilter(worker)}
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border transition-colors ${
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
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">参加者 (全員)</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {uniqueParticipants.map((participant) => (
                          <button
                            key={participant}
                            onClick={() => toggleParticipantFilter(participant)}
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border transition-colors ${
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
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">曜日</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {uniqueDays.map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleDayFilter(day)}
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border transition-colors ${
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
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">ステータス</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {uniqueStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => toggleStatusFilter(status)}
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border transition-colors ${
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
                    height="70vh"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    selectable={true}
                    locale="ja"
                    events={formattedEvents}
                    businessHours={true}
                    displayEventTime={false}
                    eventContent={renderEventContent}
                    dateClick={(info) => {
                      const clickedDate = new Date(info.date);
                      setSelectedDate(clickedDate);
                      setCreateDate(format(clickedDate, "yyyy-MM-dd"));
                      setIsCreateModalOpen(true);
                    }}
                    eventClick={handleEventClick}
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
        
        {/* Edit Calendar Event Modal */}
        {selectedEvent && (
          <EditCalendarEventModal
            modalOpen={isEditModalOpen}
            clickModalClose={handleModalClose}
            calendarEvent={selectedEvent}
          />
        )}
        {isCreateModalOpen && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="max-w-[375px] xs:max-w-[425px] w-[90vw] max-h-[90vh] overflow-y-auto">
              <CreateCalendarEvent
                modalOpen={isCreateModalOpen}
                clickModalClose={() => setIsCreateModalOpen(false)}
                currentLocation="/calendar"
                initialDate={createDate}
              />
            </DialogContent>
          </Dialog>
        )}
      </RequireAuth>
    </Layout>
  );
};

export default WindCalendar;
