import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserCharacterCard } from '../types';
import useLocalStorage from './useLocalStorage';

export default function useUserCharacter() {
  // 从本地存储加载用户人设列表
  const [userCharacters, setUserCharacters] = useLocalStorage<UserCharacterCard[]>('user-characters', []);
  
  // 当前选中的用户人设ID
  const [selectedUserCharacterId, setSelectedUserCharacterId] = useLocalStorage<string | null>('selected-user-character-id', null);
  
  // 选中的用户人设对象
  const selectedUserCharacter = userCharacters.find(character => character.id === selectedUserCharacterId) || null;
  
  // 初始化默认用户人设
  useEffect(() => {
    if (userCharacters.length === 0) {
      // 添加默认用户人设
      const defaultUserCharacter: UserCharacterCard = {
        id: uuidv4(),
        name: '默认用户',
        characterDescription: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'user'
      };
      
      setUserCharacters([defaultUserCharacter]);
      setSelectedUserCharacterId(defaultUserCharacter.id);
    }
  }, [userCharacters.length, setUserCharacters, setSelectedUserCharacterId]);
  
  // 添加新用户人设
  const addUserCharacter = useCallback((character: UserCharacterCard) => {
    // 检查是否已存在相同ID的人设
    setUserCharacters(prevCharacters => {
      const existingCharacterIndex = prevCharacters.findIndex(c => c.id === character.id);
      
      if (existingCharacterIndex !== -1) {
        // 如果已存在，更新现有人设
        const updatedCharacters = [...prevCharacters];
        updatedCharacters[existingCharacterIndex] = {
          ...character,
          updatedAt: new Date()
        };
        return updatedCharacters;
      } else {
        // 如果不存在，添加新人设
        return [...prevCharacters, character];
      }
    });
  }, [setUserCharacters]);
  
  // 更新用户人设
  const updateUserCharacter = useCallback((updatedCharacter: UserCharacterCard) => {
    setUserCharacters(prevCharacters => 
      prevCharacters.map(character => 
        character.id === updatedCharacter.id 
          ? { ...updatedCharacter, updatedAt: new Date() } 
          : character
      )
    );
  }, [setUserCharacters]);
  
  // 删除用户人设
  const deleteUserCharacter = useCallback((characterId: string) => {
    setUserCharacters(prevCharacters => prevCharacters.filter(character => character.id !== characterId));
    
    // 如果删除的是当前选中的人设，清空选中ID
    if (selectedUserCharacterId === characterId) {
      setSelectedUserCharacterId(null);
    }
  }, [selectedUserCharacterId, setUserCharacters, setSelectedUserCharacterId]);
  
  // 选择用户人设
  const selectUserCharacter = useCallback((character: UserCharacterCard) => {
    setSelectedUserCharacterId(character.id);
  }, [setSelectedUserCharacterId]);
  
  // 清除选中的用户人设
  const clearSelectedUserCharacter = useCallback(() => {
    setSelectedUserCharacterId(null);
  }, [setSelectedUserCharacterId]);
  
  return {
    userCharacters,
    selectedUserCharacter,
    selectedUserCharacterId,
    addUserCharacter,
    updateUserCharacter,
    deleteUserCharacter,
    selectUserCharacter,
    clearSelectedUserCharacter
  };
} 