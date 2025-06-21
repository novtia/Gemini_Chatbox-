import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import PromptEditModal from './components/PromptEditModal';
import ModelCharacterModal from './components/CharacterModal';
import { ChatMessage } from './types';
import { useConfigContext } from './contexts/ConfigContext';
import useChatManager from './hooks/useChatManager';
import useMessageHandler from './hooks/useMessageHandler';
import usePromptManager from './hooks/usePromptManager';
import useModelManager from './hooks/useModelManager';
import usePresetManager from './hooks/usePresetManager';
import useModelCharacter from './hooks/useModelCharacter';
import useUserCharacter from './hooks/useUserCharacter';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUserInput, setCurrentUserInput] = useState<string>('');
  const [isPromptEditModalOpen, setIsPromptEditModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<ChatMessage | null>(null);
  
  // 使用配置上下文
  const { config } = useConfigContext();
  
  // 使用聊天管理器
  const {
    chatList,
    activeChat,
    selectChat,
    updateChat,
    deleteChat,
    createNewChat,
    importChat
  } = useChatManager(config);
  
  // 使用模型管理器
  const {
    availableModels,
    isModelsLoading,
    modelsLoadingError
  } = useModelManager();
  
  // 使用模型人设管理器
  const {
    characters,
    selectedCharacter,
    isModalOpen: isModelCharacterModalOpen,
    addCharacter,
    updateCharacter,
    selectCharacter,
    openModal: openModelCharacterModal,
    closeModal: closeModelCharacterModal
  } = useModelCharacter();
  
  // 使用用户人设管理器
  const {
    userCharacters,
    selectedUserCharacter,
    addUserCharacter,
    selectUserCharacter,
    updateUserCharacter
  } = useUserCharacter();
  
  // 使用提示词管理器
  const {
    promptCollection,
    editPrompt,
    addPrompt,
    togglePromptInQueue,
    reorderPrompts
  } = usePromptManager(config.systemInstruction || '', currentUserInput, activeChat, selectedCharacter, selectedUserCharacter);
  
  // 使用预设管理器
  const presetManagerState = usePresetManager();
  const {
    saveCurrentAsPreset,
    presets,
    activePreset,
    activePresetId,
    setActivePreset,
    exportPreset,
    importPreset,
    importPresetFromFile
  } = presetManagerState;
  
  // 使用消息处理器
  const {
    sendMessage,
    editMessage,
    deleteMessage,
    resendMessage
  } = useMessageHandler(updateChat);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理用户输入变化
  const handleUserInputChange = (input: string) => {
    setCurrentUserInput(input);
  };

  // 提示词编辑相关函数
  const handleEditPrompt = (prompt: ChatMessage | null) => {
    setEditingPrompt(prompt);
    setIsPromptEditModalOpen(true);
  };

  const handleSavePrompt = (prompt: ChatMessage) => {
    if (editingPrompt) {
      // 编辑现有提示词
      editPrompt(prompt);
    } else {
      // 添加新提示词
      addPrompt(prompt);
    }
    setIsPromptEditModalOpen(false);
    setEditingPrompt(null);
  };

  const handleClosePromptModal = () => {
    setIsPromptEditModalOpen(false);
    setEditingPrompt(null);
  };

  // 消息处理函数封装
  const handleSendMessageWrapper = async (inputMessage: string) => {
    if (!activeChat) return;
    
    // 发送消息并清空输入框
    await sendMessage(inputMessage, activeChat, promptCollection, config);
    setCurrentUserInput('');
  };

  const handleEditMessageWrapper = (messageId: string, newText: string) => {
    if (!activeChat) return;
    editMessage(activeChat, messageId, newText);
  };

  const handleDeleteMessageWrapper = (messageId: string) => {
    if (!activeChat) return;
    deleteMessage(activeChat, messageId);
  };

  const handleResendMessageWrapper = async (messageId: string) => {
    if (!activeChat) return;
    await resendMessage(activeChat, messageId, promptCollection, config);
  };

  // 处理保存提示词预设
  const handleSavePreset = (name: string, description: string, author: string) => {
    // 获取队列中的提示词ID列表
    const queuedPrompts = promptCollection.filter(p => p.isInQueue);
    const queuedPromptsIds = queuedPrompts.map(p => p.id);
    
    // 保存当前提示词队列为预设
    saveCurrentAsPreset(name, description, author, promptCollection, queuedPromptsIds);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        activeChat={activeChat}
        setActiveChat={selectChat}
        chatHistory={chatList}
        onCreateNewChat={createNewChat}
        onImportChat={importChat}
        availableModels={availableModels}
        isModelsLoading={isModelsLoading}
        modelsLoadingError={modelsLoadingError}
        promptCollection={promptCollection}
        onEditPrompt={handleEditPrompt}
        onTogglePromptInQueue={togglePromptInQueue}
        onReorderPrompts={reorderPrompts}
        inputText={currentUserInput}
        messages={activeChat?.messages || []}
        systemInstruction={config.systemInstruction || ''}
        currentSessionId={activeChat?.id}
        onSavePreset={handleSavePreset}
        presetManagerState={presetManagerState}
      />
      <ChatArea
        activeChat={activeChat}
        onUpdateChat={updateChat}
        onDeleteChat={deleteChat}
        availableModels={availableModels}
        isModelsLoading={isModelsLoading}
        modelsLoadingError={modelsLoadingError}
        promptCollection={promptCollection}
        onEditPrompt={handleEditPrompt}
        onTogglePromptInQueue={togglePromptInQueue}
        onReorderPrompts={reorderPrompts}
        onUserInputChange={handleUserInputChange}
        onSendMessage={handleSendMessageWrapper}
        onEditMessage={handleEditMessageWrapper}
        onDeleteMessage={handleDeleteMessageWrapper}
        onResendMessage={handleResendMessageWrapper}
        systemInstruction={config.systemInstruction || ''}
        currentSessionId={activeChat?.id}
        onOpenModelCharacter={openModelCharacterModal}
        selectedCharacter={selectedCharacter}
        selectedUserCharacter={selectedUserCharacter}
      />

      {/* 提示词编辑弹窗 */}
      <PromptEditModal
        isOpen={isPromptEditModalOpen}
        onClose={handleClosePromptModal}
        onSave={handleSavePrompt}
        prompt={editingPrompt}
        theme="dark"
        fontSize="medium"
      />
      
      {/* 人设弹窗 */}
      <ModelCharacterModal
        isOpen={isModelCharacterModalOpen}
        onClose={closeModelCharacterModal}
        onSelectCharacter={selectCharacter}
        onSelectUserCharacter={selectUserCharacter}
        characters={characters}
        userCharacters={userCharacters}
        onAddCharacter={addCharacter}
        onAddUserCharacter={addUserCharacter}
        onUpdateUserCharacter={updateUserCharacter}
        onUpdateCharacter={updateCharacter}
      />
    </div>
  );
};

export default App;
