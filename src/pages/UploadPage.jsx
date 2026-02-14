import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { PageHeader, EmptyState } from '@/components/shared/Components'
import { Upload, Trash2, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { fmt } from '@/lib/utils'

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const loadFiles = () => {
    api.getFiles().then(setFiles).catch(() => {})
  }

  useEffect(() => { loadFiles() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    setResult(null)
    try {
      const res = await api.uploadOrders(file)
      setResult(res)
      loadFiles()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este archivo y todas sus órdenes?')) return
    try {
      await api.deleteFile(id)
      loadFiles()
    } catch {}
  }

  return (
    <div className="animate-fade-in max-w-3xl">
      <PageHeader emoji="📁" title="Upload Data" subtitle="Sube tus reportes de Dropi" />

      {/* Upload Zone */}
      <div
        className="card border-dashed border-2 border-border hover:border-primary/40 transition-colors cursor-pointer text-center py-12 mb-6"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleUpload}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-secondary">Procesando archivo...</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="font-semibold mb-1">Arrastra o haz clic para subir</p>
            <p className="text-sm text-text-secondary">CSV o Excel de Dropi</p>
          </>
        )}
      </div>

      {/* Result message */}
      {result && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
          <CheckCircle size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Archivo procesado exitosamente</p>
            <p className="text-xs text-text-secondary mt-1">
              {fmt(result.rows_inserted || result.row_count)} órdenes • País: {result.country || 'Auto'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-accent-red mt-0.5" />
          <p className="text-sm text-accent-red">{error}</p>
        </div>
      )}

      {/* File list */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Archivos subidos</h3>
        {files.length === 0 ? (
          <p className="text-sm text-text-muted p-4 bg-bg-800 rounded-lg border border-border">
            No hay archivos. Sube tu primer reporte.
          </p>
        ) : (
          <div className="space-y-2">
            {files.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-4 bg-bg-800 rounded-lg border border-border hover:border-border-hover transition-colors">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">{f.file_name}</p>
                    <p className="text-xs text-text-muted">
                      {fmt(f.row_count)} órdenes • {f.country || '—'} • {f.date_min} → {f.date_max}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(f.id)} className="text-text-muted hover:text-accent-red transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
