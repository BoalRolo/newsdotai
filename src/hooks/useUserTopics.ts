import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export interface Topic {
  id: string;
  label: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UseUserTopicsReturn {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  addTopic: (label: string, topic: string) => Promise<void>;
  editTopic: (id: string, label: string, topic: string) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useUserTopics = (): UseUserTopicsReturn => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar tópicos do usuário em tempo real
  useEffect(() => {
    if (!user?.uid) {
      setTopics([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const topicsRef = collection(db, "users", user.uid, "topics");
    const q = query(topicsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const topicsData: Topic[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          label: doc.data().label,
          topic: doc.data().topic,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }));
        setTopics(topicsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching topics:", err);
        setError("Failed to load topics");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Adicionar novo tópico
  const addTopic = async (label: string, topic: string): Promise<void> => {
    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    try {
      setError(null);
      const topicsRef = collection(db, "users", user.uid, "topics");
      await addDoc(topicsRef, {
        label: label.trim(),
        topic: topic.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error adding topic:", err);
      setError("Failed to add topic");
      throw err;
    }
  };

  // Editar tópico existente
  const editTopic = async (
    id: string,
    label: string,
    topic: string
  ): Promise<void> => {
    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    try {
      setError(null);
      const topicRef = doc(db, "users", user.uid, "topics", id);
      await updateDoc(topicRef, {
        label: label.trim(),
        topic: topic.trim(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error updating topic:", err);
      setError("Failed to update topic");
      throw err;
    }
  };

  // Remover tópico
  const deleteTopic = async (id: string): Promise<void> => {
    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    try {
      setError(null);
      const topicRef = doc(db, "users", user.uid, "topics", id);
      await deleteDoc(topicRef);
    } catch (err) {
      console.error("Error deleting topic:", err);
      setError("Failed to delete topic");
      throw err;
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  return {
    topics,
    loading,
    error,
    addTopic,
    editTopic,
    deleteTopic,
    clearError,
  };
};
