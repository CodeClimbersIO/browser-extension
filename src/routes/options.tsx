import React from 'react'
import { createRoot } from 'react-dom/client'
import { Options } from '@src/components/Options/Options'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<Options />)
