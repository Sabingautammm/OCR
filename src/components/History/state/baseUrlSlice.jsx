import { createSlice } from "@reduxjs/toolkit";

export const baseUrlSlice=createSlice({
    name:'base_url',
    initialState:{
        // 'backend':'http://192.168.1.140:8000/',
        'backend':'https://ocr.goodwish.com.np/',
        'frontend':'http://localhost:3000/'
    },
    reducers:{
    }
})
export default baseUrlSlice.reducer