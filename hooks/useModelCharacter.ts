import { useState, useEffect } from 'react';
import { ModelCharacterCard } from '../types';

// 本地存储键
const STORAGE_KEY = 'model-characters';

export default function useModelCharacter() {
  const [characters, setCharacters] = useState<ModelCharacterCard[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<ModelCharacterCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 初始化时从本地存储加载
  useEffect(() => {
    try {
      const storedCharacters = localStorage.getItem(STORAGE_KEY);
      if (storedCharacters) {
        setCharacters(JSON.parse(storedCharacters));
      }
    } catch (error) {
      console.error('Failed to load model characters:', error);
    }
  }, []);

  // 保存到本地存储
  const saveToLocalStorage = (updatedCharacters: ModelCharacterCard[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCharacters));
    } catch (error) {
      console.error('Failed to save model characters:', error);
    }
  };

  // 添加角色
  const addCharacter = (character: ModelCharacterCard) => {
    const updatedCharacters = [...characters, character];
    setCharacters(updatedCharacters);
    saveToLocalStorage(updatedCharacters);
  };

  // 更新角色
  const updateCharacter = (updatedCharacter: ModelCharacterCard) => {
    const updatedCharacters = characters.map(char => 
      char.id === updatedCharacter.id ? updatedCharacter : char
    );
    setCharacters(updatedCharacters);
    
    // 如果当前选中的角色被更新，也更新选中的角色
    if (selectedCharacter?.id === updatedCharacter.id) {
      setSelectedCharacter(updatedCharacter);
    }
    
    saveToLocalStorage(updatedCharacters);
  };

  // 删除角色
  const deleteCharacter = (characterId: string) => {
    const updatedCharacters = characters.filter(char => char.id !== characterId);
    setCharacters(updatedCharacters);
    
    // 如果删除的是当前选中的角色，清除选中
    if (selectedCharacter?.id === characterId) {
      setSelectedCharacter(null);
    }
    
    saveToLocalStorage(updatedCharacters);
  };

  // 选择角色
  const selectCharacter = (character: ModelCharacterCard) => {
    setSelectedCharacter(character);
    setIsModalOpen(false); // 选择后关闭模态框
  };

  // 打开模态框
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    characters,
    selectedCharacter,
    isModalOpen,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    selectCharacter,
    openModal,
    closeModal
  };
} 