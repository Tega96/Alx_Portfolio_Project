import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
};