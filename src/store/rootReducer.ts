import { combineReducers } from '@reduxjs/toolkit'
import { platformReducer } from './platformSlice'

export const rootReducer = combineReducers({
  platform: platformReducer,
})
