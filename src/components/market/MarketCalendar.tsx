import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Tag, Clock, Globe, Plus, X } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'conference' | 'launch' | 'airdrop' | 'update' | 'governance';
  project?: string;
  location?: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<Event, 'id'>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'conference' as Event['type'],
    project: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'conference',
      project: '',
      location: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Add New Event</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20 h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
              required
            >
              <option value="conference">Conference</option>
              <option value="launch">Launch</option>
              <option value="airdrop">Airdrop</option>
              <option value="update">Update</option>
              <option value="governance">Governance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Project (Optional)</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Location (Optional)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'ETH Shanghai Upgrade',
    description: 'Major Ethereum network upgrade implementing EIP-4895',
    date: '2024-03-20',
    time: '14:00',
    type: 'update',
    project: 'Ethereum'
  },
  {
    id: '2',
    title: 'Token 2024 Conference',
    description: 'Annual blockchain conference featuring industry leaders',
    date: '2024-03-22',
    time: '09:00',
    type: 'conference',
    location: 'Singapore'
  },
  {
    id: '3',
    title: 'Layer Zero Airdrop',
    description: 'Token distribution for early protocol users',
    date: '2024-03-25',
    time: '16:00',
    type: 'airdrop',
    project: 'LayerZero'
  }
];

const getEventTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'conference':
      return 'bg-purple-500/20 text-purple-400';
    case 'launch':
      return 'bg-green-500/20 text-green-400';
    case 'airdrop':
      return 'bg-blue-500/20 text-blue-400';
    case 'update':
      return 'bg-orange-500/20 text-orange-400';
    case 'governance':
      return 'bg-yellow-500/20 text-yellow-400';
  }
};

export const MarketCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEvents(prev => [...prev, event]);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dateString = currentDate.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);

      days.push(
        <div key={day} className="min-h-24 border border-white/10 p-2">
          <div className="font-medium mb-2">{day}</div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded mb-1 ${getEventTypeColor(event.type)}`}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const renderListView = () => (
    <div className="space-y-3">
      {events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(event => (
          <div
            key={event.id}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`px-2 py-1 rounded text-sm ${getEventTypeColor(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-1">{event.title}</h3>
            <p className="text-white/60 mb-3">{event.description}</p>

            <div className="flex items-center gap-4 text-sm">
              {event.project && (
                <div className="flex items-center gap-1 text-white/60">
                  <Tag className="w-4 h-4" />
                  <span>{event.project}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1 text-white/60">
                  <Globe className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
          <div className="h-6 w-px bg-white/10" />
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              view === 'month' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              view === 'list' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white/60 p-2 font-medium">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      ) : (
        renderListView()
      )}

      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onAdd={addEvent}
      />
    </div>
  );
};