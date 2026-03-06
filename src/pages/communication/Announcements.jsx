import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Plus } from 'lucide-react'
import pinIcon from '@/assets/pinIcon.svg'
import Trash from '@/assets/Trash.svg'
import edit from '@/assets/edit.svg'
import calenderIcon from '@/assets/calenderIcon.svg'
import logo from '@/assets/BookLogo1.png'
import Push_Pin from '@/assets/Push_Pin.svg'

import {  Share2 } from 'lucide-react'

const announcements = [
  {
    id: 1,
    title: 'Winter Break Schedule',
    body: 'School will be closed from December 20 to January 5. Classes resume on January 6, 2026.',
    date: '25-12-2025',
  },
  {
    id: 2,
    title: 'Parent-Teacher Meeting',
    body: 'The quarterly parent-teacher meeting is scheduled for October 20, 2025, from 2 PM to 5 PM.',
    date: '25-11-2025',
  },
  {
    id: 3,
    title: 'Science Fair Registration',
    body: 'Register for the annual science fair by October 25. All students from grades 9-12 are encouraged to participate.',
    date: '25-10-2025',
  },
]

const Announcements = () => {
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false)
  const [announcementList, setAnnouncementList] = useState(announcements)
  const [pinnedIds, setPinnedIds] = useState([])

  const togglePin = (id) => {
    setPinnedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const handleDelete = (id) => {
    setAnnouncementList((prev) => prev.filter((item) => item.id !== id))
    setPinnedIds((prev) => prev.filter((itemId) => itemId !== id))
  }

  const pinnedAnnouncements = announcementList.filter((item) => pinnedIds.includes(item.id))
  const recentAnnouncements = announcementList.filter((item) => !pinnedIds.includes(item.id))

  return (
    <div className="space-y-6 ">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl lg:text-4xl">Communications</h1>
          <p className="mt-2 text-sm text-gray-800 sm:text-base md:text-lg">Manage School-wide communications</p>
        </div>
        <Button
          size="sm"
          className="w-fit gap-2 rounded px-4 py-2 text-sm sm:px-5 sm:text-base lg:px-6"
          onClick={() => setIsAddAnnouncementOpen(true)}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded bg-white sm:h-5 sm:w-5">
              <Plus className="h-4 w-4 text-black sm:h-5 sm:w-5" />
            </span>
          Add Announcements
        </Button>
      </div>

      <Modal
        isOpen={isAddAnnouncementOpen}
        onClose={() => setIsAddAnnouncementOpen(false)}
        title=""
        size="sm"
        className="border-2 border-gray-400 rounded-lg"
      
      >
        <div className="space-y-4 px-4 sm:px-5">
          <div className=" flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-900">
              <img src={logo} alt="Logo" className="h-10 w-12 sm:h-12 sm:w-14 lg:h-14 lg:w-16" />
              <span className="text-3xl font-serif font-semibold sm:text-4xl lg:text-5xl">SMS</span>
            </div>
            <p className="mt-2 mb-2 text-lg font-semibold text-gray-800 sm:text-xl lg:text-2xl">Add New Announcemnet</p>
          </div>

          <div className="space-y-1">
            <Input label="Title" className="bg-gray-100 border-2 border-gray-900 rounded-xl" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">Details</label>
              <textarea
                rows="4"
                className="w-full rounded-xl border-2 border-gray-900 bg-gray-100 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 ">
            <Button
              variant="outline"
              size="md"
              className="rounded border-2 border-gray-600"
              onClick={() => setIsAddAnnouncementOpen(false)}
            >
              Cancel
            </Button>
            <Button size="md" className="rounded">Save</Button>
          </div>
        </div>
      </Modal>


      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Pinned Announcements</h2>

        {pinnedAnnouncements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600 sm:text-base">
            No pinned announcements yet. Click the pin icon to add one here.
          </div>
        ) : (
          <div className="space-y-4">
            {pinnedAnnouncements.map((item) => (
              <div key={item.id} className="max-w-2xl rounded-xl bg-[#E9EDF4] px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">{item.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <button
                      className="rounded-md bg-gray-200 p-1"
                      onClick={() => togglePin(item.id)}
                      aria-pressed="true"
                    >
                      <img src={Push_Pin} alt="Unpin" className="w-4 h-4" />
                    </button>
                    <button
                      className="rounded-md p-1 hover:bg-gray-200"
                      onClick={() => handleDelete(item.id)}
                    >
                      <img src={Trash} alt="Delete" className="w-4 h-4" />
                    </button>
                    <button className="rounded-md p-1 hover:bg-gray-200">
                      <img src={edit} alt="Edit" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-700 sm:mt-5 sm:text-base lg:text-xl">{item.body}</p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-300 pt-3 sm:mt-8 lg:mt-10">
                  <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                    <img src={calenderIcon} alt="Calendar" className="h-4 w-4" />
                    {item.date}
                  </div>
                  <Button size="sm" className="gap-2 rounded px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Recent Announcements</h2>

        <div className="space-y-4">
          {recentAnnouncements.map((item) => (
            <div key={item.id} className="rounded-xl bg-[#E9EDF4] p-4 sm:p-5 lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">{item.title}</h3>
                <div className="flex items-center gap-2 text-gray-500">
                  <button
                    className="rounded-md p-1 hover:bg-gray-200"
                    onClick={() => togglePin(item.id)}
                    aria-pressed="false"
                  >
                    <img src={pinIcon} alt="Pin" className="w-4 h-4" />
                  </button>
                  <button
                    className="rounded-md p-1 hover:bg-gray-200"
                    onClick={() => handleDelete(item.id)}
                  >
                    <img src={Trash} alt="Delete" className="w-4 h-4" />
                  </button>
                  <button className="rounded-md p-1 hover:bg-gray-200">
                    <img src={edit} alt="Edit" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-700 sm:mt-5 sm:text-base lg:text-xl">{item.body}</p>

              <div className="mt-6 flex items-center justify-between border-t border-gray-300 pt-3 sm:mt-8 lg:mt-10">
                <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                  <img src={calenderIcon} alt="Calendar" className="h-4 w-4" />
                  {item.date}
                </div>
                <Button size="sm" className="gap-2 rounded px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Announcements

