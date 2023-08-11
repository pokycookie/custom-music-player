'use client'

import ExportModal from '@/components/modal/export'
import useModal from '@/hooks/useModal'
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'

export default function SettingPage() {
  const exportModal = useModal({
    autoClose: false,
    className: 'w-4/5 h-fit max-w-2xl',
  })

  useEffect(() => {
    exportModal.setContent(<ExportModal close={exportModal.closeModal} />)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <section className="p-4 m-5 rounded bg-zinc-800 text-zinc-400">
        <h2 className="pb-3 mb-3 text-lg font-semibold border-b border-zinc-500">
          Data
        </h2>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm">Import</h3>
          <button className="flex items-center justify-center w-16 p-2 rounded bg-zinc-700 hover:bg-zinc-600">
            <FontAwesomeIcon className="w-4 h-4" icon={faFileImport} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm">Export</h3>
          <button
            className="flex items-center justify-center w-16 p-2 rounded bg-zinc-700 hover:bg-zinc-600"
            onClick={exportModal.openModal}
          >
            <FontAwesomeIcon className="w-4 h-4" icon={faFileExport} />
          </button>
        </div>
      </section>
      {exportModal.modal}
    </>
  )
}
