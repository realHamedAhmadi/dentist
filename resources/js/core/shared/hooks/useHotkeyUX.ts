import { useEffect, useState } from "react"
import { Event } from "@/core/facades/Event"
import {
    HotkeyHint,
    SequenceHintsPayload,
    RecordingPayload
} from "@/core/platform/hotkey/contracts/HotkeyEvent"
import {HotkeyEvents} from '@/core/platform/tokens/hotkey';
import {IEvent} from "@/core/platform/event/Event";

/**
 * React hook for hotkey UX state
 */
export function useHotkeyUX() {

    const [state, setState] = useState<{
        hintsVisible:boolean
        sequence: string[]
        hints: HotkeyHint[]
        recording: boolean
    }>({
        hintsVisible:false,
        sequence: [],
        hints: [],
        recording: false
    })

    useEffect(() => {

        const onHintsShown = (event:IEvent) => {
            const payload=event.payload;
            setState(prev => ({
                ...prev,
                hintsVisible:payload.sequence.length>0,
                sequence: payload.sequence ?? [],
                hints: payload.hints ?? []
            }))
        }
        const onHintsHidden = () => {
            setState(prev => ({
                ...prev,
                hintsVisible:false,
                sequence: [],
                hints: []
            }))
        }

        const onRecordingStart = () => {

            setState({
                recording: true,
                hintsVisible:false,
                sequence: [],
                hints: []
            })
        }

        const onRecordingUpdate = (event:IEvent) => {
            const payload=event.payload as RecordingPayload
            setState(prev => ({
                ...prev,
                sequence: payload.sequence ?? []
            }))
        }

        const onRecordingStop = () => {
            setState({
                recording: false,
                hintsVisible:false,
                sequence: [],
                hints: []
            })
        }

        Event.on(HotkeyEvents.SequenceHintsShown, onHintsShown)
        Event.on(HotkeyEvents.SequenceHintsHidden, onHintsHidden)
        Event.on(HotkeyEvents.RecordingStart, onRecordingStart)
        Event.on(HotkeyEvents.RecordingUpdate, onRecordingUpdate)
        Event.on(HotkeyEvents.RecordingStop, onRecordingStop)

        return () => {

            Event.off(HotkeyEvents.SequenceHintsShown, onHintsShown)
            Event.off(HotkeyEvents.SequenceHintsHidden, onHintsHidden)
            Event.off(HotkeyEvents.RecordingStart, onRecordingStart)
            Event.off(HotkeyEvents.RecordingUpdate, onRecordingUpdate)
            Event.off(HotkeyEvents.RecordingStop, onRecordingStop)

        }

    }, [])

    return state
}
