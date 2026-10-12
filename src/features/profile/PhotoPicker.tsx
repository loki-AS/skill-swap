import { useId, useState, type ChangeEvent } from 'react'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const OUTPUT_PX = 256

/** Downscales to a 256px square JPEG data URL so photos fit comfortably in localStorage. */
async function toAvatarDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = OUTPUT_PX
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, OUTPUT_PX, OUTPUT_PX)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}

interface PhotoPickerProps {
  name: string
  value: string
  onChange: (dataUrl: string) => void
}

export function PhotoPicker({ name, value, onChange }: PhotoPickerProps) {
  const inputId = useId()
  const [error, setError] = useState('')

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Choose an image file (JPG, PNG, WebP).')
    if (file.size > MAX_FILE_BYTES) return setError('That image is over 5 MB — try a smaller one.')
    try {
      onChange(await toAvatarDataUrl(file))
      setError('')
    } catch {
      setError('We couldn’t read that image. Try another file.')
    }
  }

  return (
    <div className="photo-picker">
      <Avatar name={name || '?'} src={value} size="xl" decorative={false} />
      <div className="stack-xs">
        <span className="field__label">Profile photo</span>
        <div className="row">
          <label htmlFor={inputId} className="btn btn--secondary btn--sm">
            <Icon name="camera" size={16} />
            {value ? 'Change photo' : 'Upload photo'}
          </label>
          <input id={inputId} type="file" accept="image/*" className="sr-only" onChange={onFile} />
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange('')}>
              Remove
            </Button>
          )}
        </div>
        {error ? (
          <p className="field__error" role="alert">
            {error}
          </p>
        ) : (
          <p className="field__hint">Optional. Without one we’ll use your initials.</p>
        )}
      </div>
    </div>
  )
}
