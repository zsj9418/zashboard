import tippy, { type Instance } from 'tippy.js'

export const useTooltip = () => {
  let tippyInstance: Instance | null = null

  const showTip = (event: Event, content: string | HTMLElement) => {
    tippyInstance?.destroy()
    tippyInstance = tippy(event.target as HTMLElement, {
      content,
      placement: 'top',
      animation: 'scale',
      appendTo: 'parent',
      allowHTML: true,
      onHidden: () => {
        tippyInstance?.destroy()
        tippyInstance = null
      },
    })
    tippyInstance.show()
  }

  return {
    showTip,
  }
}
