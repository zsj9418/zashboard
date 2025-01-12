import tippy, { type Instance } from 'tippy.js'

let appContent: HTMLElement

export const useTooltip = () => {
  if (!appContent) {
    appContent = document.getElementById('app-content')!
  }

  let tippyInstance: Instance | null = null

  const showTip = (event: Event, content: string | HTMLElement) => {
    tippyInstance?.destroy()
    tippyInstance = tippy(event.target as HTMLElement, {
      content,
      placement: 'top',
      animation: 'scale',
      appendTo: appContent,
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
