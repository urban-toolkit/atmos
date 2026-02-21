import './Editor.css'
import React, { useState, useEffect } from 'react'

import { JsonEditor, githubLightTheme } from 'json-edit-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faFileCode } from '@fortawesome/free-regular-svg-icons'

import useUndo from 'use-undo'
import { Alert, Button, Snackbar, type SnackbarCloseReason } from '@mui/material'

// import type { ParsedSpec } from "atmos"
type ParsedSpec = unknown

// initialData: the original JSON data that was provided to the editor when it first opened. 
// It is the baseline or starting point, the original file or configuration before the user makes edits.

// editorData: current content of the JSON editor. Everything the user has typed or modified, including any changes that haven’t been applied yet. It is what is applied.

// hasUnsavedChanges: A boolean flag that tells you whether editorData is different from initialData.


interface EditorProps {
  onApply: (editorData: ParsedSpec | ParsedSpec[] | null) => void
  initialData: ParsedSpec | ParsedSpec[] | null
  showAlert: boolean
  setShowAlert: (alert: boolean) => void
}

const Editor: React.FC<EditorProps> = ({ onApply, initialData, showAlert, setShowAlert }) => {

  // State management
  const [isOpen, setIsOpen] = useState(true)
  
  const [
    { present: editorData},
    { set: setEditorData, reset: resetEditorData, undo: undoEditorData, redo: redoEditorData, canUndo: canUndoEditorData, canRedo: canRedoEditorData }
  ] = useUndo(initialData)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const safeEditorData = editorData ?? (Array.isArray(initialData) ? [] : {})
  
  // Functions
  
  const toggle = () => setIsOpen(prev => !prev)

  const handleCloseAlert = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setShowAlert(false)
  }

  const isEmpty = (data: unknown) => {
    if (data == null) return true
    if (Array.isArray(data)) return data.length === 0
    if (typeof data === "object") return Object.keys(data as object).length === 0
    return false
  }

  // const emptyValue: ParsedSpec | ParsedSpec[] | null = Array.isArray(initialData) ? [] : null
  const emptyValue: unknown = Array.isArray(initialData) ? [] : null

  // UseEffect

  useEffect(() => {
    resetEditorData(initialData)
  }, [initialData, resetEditorData])

  useEffect(() => {
    const dataIsDifferent = JSON.stringify(editorData) !== JSON.stringify(initialData)
    setHasUnsavedChanges(dataIsDifferent)
  
  }, [editorData, initialData])

  // Render
  
  return (
    <div id="editor-wrapper" className={isOpen ? 'open' : ''}>

      {/* Alert */}
      <Snackbar
        open={showAlert}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseAlert}
          severity="error" 
          sx={{ width: '100%' }}
        >
          Check the console for errors.
        </Alert>
      </Snackbar>
      
      {/* Toggle */}
      <button className="toggle-button" onClick={toggle}>
        {isOpen
          ? <FontAwesomeIcon icon={faArrowLeft}/>
          : <FontAwesomeIcon icon={faFileCode}/>
        }
      </button>

      <div className="editor-content">
        
        {/* JSON Editor */}
        <JsonEditor
          data={editorData}
          // setData={(newData) => setEditorData(newData as ParsedSpec | ParsedSpec[] | null)}
          setData={(newData: any) => setEditorData(newData as any)}
          rootName=""
          collapse={isEmpty(editorData)}
          theme={[
            githubLightTheme,
            {
              styles: {
                container: {
                  backgroundColor: '#f0f0f054',
                }
              }
            }
          ]}
          rootFontSize={14}
          showCollectionCount={"when-closed"}
          showArrayIndices={false}
        />
      </div>

      
      <div className="editor-footer">

        {/* Undo / Redo / Reset */}
        <div className="editor-actions">
          <Button
            variant="outlined"
            style={{ fontSize: '12px', outline: 'none' }}
            size='small'
            onClick={() => { undoEditorData() }}
            disabled={!canUndoEditorData}
            startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          >
            Undo
          </Button>

          <Button
            variant="outlined"
            style={{ fontSize: '12px', outline: 'none' }}
            size='small'
            onClick={() => { redoEditorData() }}
            disabled={!canRedoEditorData}
            endIcon={<FontAwesomeIcon icon={faArrowRight} />}
          >
            Redo
          </Button>

          <Button
            variant="outlined"
            color="error"
            style={{ fontSize: '12px', outline: 'none' }}
            size='small'
            onClick={() => { resetEditorData(emptyValue); onApply(emptyValue) }}
            disabled={isEmpty(editorData)}
          >
            Reset
          </Button>
        </div>

        {/* Apply */}
        <Button
          variant="contained"
          style={{ fontSize: '12px', outline: 'none' }}
          size='small'
          onClick={() => onApply(safeEditorData as any)}
          disabled={isEmpty(editorData) || !hasUnsavedChanges}
        >
          { hasUnsavedChanges ? "Apply" : "Applied!" }
        </Button>
      </div>
    </div>
  )
}

export default Editor