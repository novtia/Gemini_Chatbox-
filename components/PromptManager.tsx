import React, { useState, useMemo, useCallback } from "react";
import { Bug, Trash2, FileText, Image, File } from "lucide-react";
import { ChatMessage, FileMessageType } from "../types";
import PromptToolbar from "./Prompt/PromptToolbar";
import PromptList from "./Prompt/PromptList";
import PresetManager from "./Prompt/PresetManager";
import SavePresetModal from "./Prompt/SavePresetModal";
import usePresetManager from "../hooks/usePresetManager";

// 临时组件实现
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  size?: string;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant, size, onClick, title, disabled = false }) => (
  <button 
    className={className}
    onClick={onClick}
    title={title}
    disabled={disabled}
  >
    {children}
  </button>
);

// 更新 PromptList 组件的 props 类型定义
interface PromptListProps {
  theme?: string;
  fontSize?: string;
  queuedPrompts: ChatMessage[];
  expandedPromptId: string | null;
  onToggleExpand: (promptId: string) => void;
  onRemoveFromQueue: (promptId: string) => void;
  onToggleEnabled: (promptId: string) => void;
  onEditClick: (prompt: ChatMessage) => void;
  draggedItemId: string | null;
  dragOverItemId: string | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, promptId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, promptId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, promptId: string) => void;
  getFileIcon?: (fileType?: FileMessageType, mimeType?: string) => React.ReactNode;
  formatFileSize?: (bytes?: number) => string;
}

// 组件属性类型
interface PromptManagerProps {
  theme?: string;
  fontSize?: string;
  onEditPrompt?: (prompt: ChatMessage | null) => void;
  onTogglePromptInQueue?: (promptId: string) => void;
  onReorderPrompts?: (reorderedPrompts: ChatMessage[]) => void;
  showHistoryPrompts?: boolean;
  onSelectHistoryPrompt?: (content: string) => void;
  promptCollection?: ChatMessage[];
  systemInstruction?: string;
  inputText?: string;
  messages?: ChatMessage[];
  currentSessionId?: string;
  onSavePresetClick?: () => void;
  presetManagerState?: any; // 添加新的prop接收预设管理器状态
}

const PromptManager: React.FC<PromptManagerProps> = ({ 
  theme = 'dark', 
  fontSize = 'medium',
  onEditPrompt,
  onTogglePromptInQueue,
  onReorderPrompts,
  showHistoryPrompts = true,
  onSelectHistoryPrompt,
  promptCollection,
  systemInstruction,
  inputText,
  messages,
  currentSessionId,
  onSavePresetClick,
  presetManagerState // 接收从父组件传入的预设管理器状态
}) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  
  // 使用预设管理器hook或从props获取
  const { 
    presets, 
    activePreset, 
    activePresetId, 
    saveCurrentAsPreset, 
    exportPreset, 
    importPresetFromFile, 
    setActivePreset,
    createDefaultPreset
  } = presetManagerState || usePresetManager();
  
  // 输出日志用于调试
  console.log("PromptManager - presets:", presets);
  console.log("PromptManager - activePresetId:", activePresetId);
  
  // 黑客帝国风格样式
  const bgColor = 'bg-black';
  const textColor = 'text-green-400';
  const toolbarBgColor = 'bg-black bg-opacity-80 backdrop-blur-sm';
  const buttonHoverBg = 'hover:bg-green-500 hover:bg-opacity-20';

  // 筛选出在队列中的提示词
  const queuedPrompts = useMemo(() => {
    return promptCollection?.filter(p => p.isInQueue) || [];
  }, [promptCollection]);
  
  // 提示词排序列表
  const queuedPromptsIds = useMemo(() => {
    return queuedPrompts.map(p => p.id);
  }, [queuedPrompts]);
  
  console.log("PromptManager - 队列中的提示词:", queuedPrompts.map(p => p.id));

  // 处理编辑按钮点击
  const handleEditClick = (prompt: ChatMessage) => {
    if (onEditPrompt) {
      onEditPrompt(prompt);
    } else {
      console.log("编辑提示词:", prompt.name);
    }
  };

  // 处理添加新提示词按钮点击
  const handleAddPrompt = () => {
    if (onEditPrompt) {
      onEditPrompt(null); // 传递null表示创建新提示词
    } else {
      console.log("添加新提示词");
    }
  };
  
  // 处理插入提示词按钮点击
  const handleInsertPrompt = () => {
    if (selectedPromptId && onTogglePromptInQueue) {
      onTogglePromptInQueue(selectedPromptId);
      // 插入后清空选择
      setSelectedPromptId("");
    } else {
      console.log("插入提示词到队列:", selectedPromptId);
    }
  };
  
  // 处理提示词选择变化
  const handlePromptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPromptId(e.target.value);
  };
  
  // 处理调试按钮点击 - 输出当前提示词队列排序中的所有role，parts，id
  const handleDebugClick = () => {
    // 筛选出在队列中的提示词
    const promptsInQueue = queuedPrompts;
    
    // 创建包含所需信息的数组
    const debugInfo = promptsInQueue.map(prompt => {
      // 如果是历史记录提示词，解析其中的消息
      if (prompt.isHistory && prompt.parts && prompt.parts[0] && prompt.parts[0].text) {
        try {
          // 尝试解析历史记录中的JSON字符串
          const historyMessages = JSON.parse(prompt.parts[0].text);
          
          // 如果解析成功且是数组，则返回解析后的消息
          if (Array.isArray(historyMessages)) {
            return historyMessages.map(msg => ({
              id: msg.id,
              parts: msg.parts,
              role: msg.role,
              Data: msg.data,
              isFileMessage: msg.isFileMessage,
              fileName: msg.fileName,
              fileType: msg.fileType,
              fileMimeType: msg.fileMimeType,
              fileSize: msg.fileSize
            }));
          }
        } catch (error) {
          console.error("解析历史记录失败:", error);
        }
      }
      
      // 对于非历史记录提示词或解析失败的情况，返回原始信息
      return {
        id: prompt.id,
        parts: prompt.parts,
        role: prompt.role,
        isFileMessage: prompt.isFileMessage,
        fileName: prompt.fileName,
        fileType: prompt.fileType
      };
    });
    
    // 展平数组（将嵌套数组扁平化）
    const flattenedDebugInfo = debugInfo.flat();
    
    // 在控制台中输出调试信息
    console.log("当前提示词队列中的提示词信息:", JSON.stringify(flattenedDebugInfo, null, 2));
  };

  // 处理启用/禁用切换
  const handleToggleEnabled = (promptId: string) => {
    // 查找提示词
    const promptToToggle = promptCollection?.find(p => p.id === promptId);
    
    if (!promptToToggle) {
      console.error("找不到要切换启用状态的提示词:", promptId);
      return;
    }
    
    // 创建所有提示词的副本，并更新目标提示词的enabled状态
    const updatedPrompts = promptCollection?.map(p => 
      p.id === promptId ? { ...p, enabled: !p.enabled } : p
    );
    
    // 调用回调函数更新提示词状态
    if (onReorderPrompts && updatedPrompts) {
      console.log("调用onReorderPrompts更新提示词启用状态，总数:", updatedPrompts.length);
      onReorderPrompts(updatedPrompts);
    } else {
      console.error("无法更新提示词状态: onReorderPrompts回调未提供");
    }
  };

  // 处理从队列中移除提示词
  const handleRemoveFromQueue = (promptId: string) => {
    console.log("从队列中移除提示词:", promptId);
    
    // 查找提示词
    const promptToRemove = promptCollection?.find(p => p.id === promptId);
    
    if (!promptToRemove) {
      console.error("找不到要移除的提示词:", promptId);
      return;
    }
    
    // 创建所有提示词的副本，并更新目标提示词的isInQueue状态
    const updatedPrompts = promptCollection?.map(p => 
      p.id === promptId ? { ...p, isInQueue: false } : p
    );
    
    // 调用回调函数更新提示词状态
    if (onReorderPrompts && updatedPrompts) {
      console.log("调用onReorderPrompts更新提示词状态，总数:", updatedPrompts.length);
      onReorderPrompts(updatedPrompts);
    } else {
      console.error("无法更新提示词状态: onReorderPrompts回调未提供");
    }
  };

  // 处理展开/折叠提示词内容
  const handleToggleExpand = (promptId: string) => {
    setExpandedPromptId(expandedPromptId === promptId ? null : promptId);
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, promptId: string) => {
    setDraggedItemId(promptId);
    // 设置拖拽效果和数据
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', promptId);
    
    // 获取被拖拽的提示词信息
    const draggedPrompt = promptCollection?.find(p => p.id === promptId);
    if (!draggedPrompt) return;
    
    // 创建更精美的拖拽图像
    const dragImage = document.createElement('div');
    
    // 应用黑客帝国风格的样式
    dragImage.className = `p-3 rounded-md shadow-lg border backdrop-blur-sm`;
    dragImage.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    dragImage.style.borderColor = 'rgba(0, 255, 65, 0.4)';
    dragImage.style.color = 'rgb(74, 222, 128)';
    dragImage.style.fontFamily = 'monospace';
    dragImage.style.maxWidth = '200px';
    dragImage.style.whiteSpace = 'nowrap';
    dragImage.style.overflow = 'hidden';
    dragImage.style.textOverflow = 'ellipsis';
    dragImage.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.3)';
    
    // 添加内容
    dragImage.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C7.65685 15 9 16.3431 9 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span>${draggedPrompt.name || '提示词'}</span>
      </div>
    `;
    
    // 添加动画效果
    dragImage.style.animation = 'pulse 1.5s infinite';
    
    // 添加到DOM并设置为拖拽图像
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 30, 15);
    
    // 延迟移除拖拽图像元素
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
    
    // 移除可能存在的所有拖拽图像
    const dragImages = document.querySelectorAll('.prompt-drag-image');
    dragImages.forEach(img => img.remove());
  };

  // 处理拖拽经过
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, promptId: string) => {
    e.preventDefault();
    
    // 设置拖拽效果
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItemId !== promptId) {
      setDragOverItemId(promptId);
    }
  };

  // 处理拖拽离开
  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetPromptId: string) => {
    e.preventDefault();
    
    if (!draggedItemId || draggedItemId === targetPromptId) {
      return;
    }

    console.log("拖拽放置 - 从:", draggedItemId, "到:", targetPromptId);

    // 找到拖拽项和目标项的索引
    const allQueuedPrompts = [...queuedPrompts]; // 包含所有队列中的提示词
    const draggedPromptIndex = allQueuedPrompts.findIndex(p => p.id === draggedItemId);
    const targetPromptIndex = allQueuedPrompts.findIndex(p => p.id === targetPromptId);
    
    console.log("拖拽项索引:", draggedPromptIndex, "目标项索引:", targetPromptIndex);
    
    if (draggedPromptIndex === -1 || targetPromptIndex === -1) {
      console.log("找不到拖拽项或目标项，取消排序");
      return;
    }

    // 创建新的排序后的提示词数组
    const reorderedPrompts = [...allQueuedPrompts];
    const [movedItem] = reorderedPrompts.splice(draggedPromptIndex, 1);
    reorderedPrompts.splice(targetPromptIndex, 0, movedItem);
    
    console.log("重新排序后的提示词:", reorderedPrompts.map(p => p.id));
    
    // 检查是否有重复ID
    const uniqueIds = new Set<string>();
    const hasDuplicates = reorderedPrompts.some(p => {
      if (uniqueIds.has(p.id)) {
        console.error("发现重复ID:", p.id);
        return true;
      }
      uniqueIds.add(p.id);
      return false;
    });
    
    if (hasDuplicates) {
      console.error("排序后存在重复ID，取消排序");
      return;
    }
    
    // 更新所有提示词，保留非队列中的提示词
    const nonQueuePrompts = promptCollection?.filter(p => !p.isInQueue) || [];
    
    // 确保队列中的所有提示词都标记为isInQueue=true
    const updatedQueuedPrompts = reorderedPrompts.map(p => ({
      ...p,
      isInQueue: true
    }));
    
    // 确保系统提示词、用户输入提示词和历史记录提示词不会被重复添加
    const allReorderedPrompts = [...updatedQueuedPrompts];
    
    // 添加非队列中的提示词
    nonQueuePrompts.forEach(p => {
      // 检查是否已经存在相同ID的提示词
      if (!allReorderedPrompts.some(existingPrompt => existingPrompt.id === p.id)) {
        allReorderedPrompts.push(p);
      }
    });
    
    // 确保保持prompt的原始引用，避免丢失特殊属性
    const finalOrderedPrompts = allReorderedPrompts.map(orderedPrompt => {
      // 在原始集合中查找完整的prompt对象
      const originalPrompt = promptCollection?.find(p => p.id === orderedPrompt.id);
      if (originalPrompt) {
        // 返回原始prompt但更新isInQueue状态
        return {
          ...originalPrompt,
          isInQueue: orderedPrompt.isInQueue
        };
      }
      return orderedPrompt;
    });
    
    // 输出最终排序后的IDs以便检查
    console.log("最终排序后的提示词IDs:", finalOrderedPrompts.map(p => p.id));
    
    // 调用回调函数更新提示词顺序
    if (onReorderPrompts) {
      onReorderPrompts(finalOrderedPrompts);
    } else {
      console.log("重新排序提示词，但未提供回调函数");
    }

    // 重置拖拽状态
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  // 应用预设
  const handleApplyPreset = useCallback((presetId: string) => {
    const selectedPreset = presets.find(p => p.id === presetId);
    if (!selectedPreset || !promptCollection) return;
    
    console.log("应用预设:", selectedPreset.name);
    console.log("预设中的提示词:", selectedPreset.prompts.map(p => ({id: p.id, name: p.name})));
    console.log("预设的promptsList顺序:", selectedPreset.promptsList);
    
    // 1. 按照promptsList的顺序重新构建提示词数组
    const orderedPrompts: ChatMessage[] = [];
    
    // 查找当前的模型人设提示词，以便保留角色信息
    const currentModelRolePrompt = promptCollection.find(p => p.id === 'model-role-prompt');
    
    // 检查当前模型人设提示词是否有有效内容（是否选择了角色）
    const hasSelectedCharacter = currentModelRolePrompt && 
                               currentModelRolePrompt.parts && 
                               currentModelRolePrompt.parts[0] && 
                               currentModelRolePrompt.parts[0].text;
    
    // 查找当前的用户人设提示词，以便保留角色信息
    const currentUserRolePrompt = promptCollection.find(p => p.id === 'user-role-prompt');
    
    // 检查当前用户人设提示词是否有有效内容（是否选择了角色）
    const hasSelectedUserCharacter = currentUserRolePrompt && 
                                   currentUserRolePrompt.parts && 
                                   currentUserRolePrompt.parts[0] && 
                                   currentUserRolePrompt.parts[0].text;
    
    // 查找当前的主提示词，以便保留内容
    const currentMainPrompt = promptCollection.find(p => p.id === 'main-prompt');
    
    // 检查当前主提示词是否有有效内容
    const hasMainPromptContent = currentMainPrompt && 
                               currentMainPrompt.parts && 
                               currentMainPrompt.parts[0] && 
                               currentMainPrompt.parts[0].text;
    
    // 首先按照promptsList的顺序添加提示词
    for (const promptId of selectedPreset.promptsList) {
      const prompt = selectedPreset.prompts.find(p => p.id === promptId);
      if (prompt) {
        // 如果是模型人设提示词，保留当前选中的角色信息（如果有的话）
        if (prompt.id === 'model-role-prompt') {
          if (hasSelectedCharacter && currentModelRolePrompt) {
            // 有选中角色，使用当前角色信息
            orderedPrompts.push({
              ...prompt,
              name: currentModelRolePrompt.name,
              parts: currentModelRolePrompt.parts,
              isInQueue: true
            });
          } else {
            // 没有选中角色，使用空内容
            orderedPrompts.push({
              ...prompt,
              name: '模型人设',
              parts: [{ text: '' }],
              isInQueue: true
            });
          }
        } 
        // 如果是用户人设提示词，保留当前选中的用户角色信息（如果有的话）
        else if (prompt.id === 'user-role-prompt') {
          if (hasSelectedUserCharacter && currentUserRolePrompt) {
            // 有选中用户角色，使用当前角色信息
            orderedPrompts.push({
              ...prompt,
              name: currentUserRolePrompt.name,
              parts: currentUserRolePrompt.parts,
              isInQueue: true
            });
          } else {
            // 没有选中用户角色，使用空内容
            orderedPrompts.push({
              ...prompt,
              name: '用户人设',
              parts: [{ text: '' }],
              isInQueue: true
            });
          }
        }
        // 如果是主提示词，保留当前内容（如果有的话）
        else if (prompt.id === 'main-prompt') {
          if (hasMainPromptContent && currentMainPrompt) {
            // 有内容，使用当前内容
            orderedPrompts.push({
              ...prompt,
              name: currentMainPrompt.name,
              parts: currentMainPrompt.parts,
              isInQueue: true
            });
          } else {
            // 没有内容，使用空内容
            orderedPrompts.push({
              ...prompt,
              name: '主提示词',
              parts: [{ text: '' }],
              isInQueue: true
            });
          }
        }
        else {
          orderedPrompts.push({
            ...prompt,
            isInQueue: true  // 在promptsList中的都标记为队列中
          });
        }
      }
    }
    
    // 然后添加不在promptsList中的提示词（标记为非队列中）
    for (const prompt of selectedPreset.prompts) {
      if (!selectedPreset.promptsList.includes(prompt.id)) {
        // 如果是模型人设提示词，保留当前选中的角色信息（如果有的话）
        if (prompt.id === 'model-role-prompt') {
          if (hasSelectedCharacter && currentModelRolePrompt) {
            // 有选中角色，使用当前角色信息
            orderedPrompts.push({
              ...prompt,
              name: currentModelRolePrompt.name,
              parts: currentModelRolePrompt.parts,
              isInQueue: false
            });
          } else {
            // 没有选中角色，使用空内容
            orderedPrompts.push({
              ...prompt,
              name: '模型人设',
              parts: [{ text: '' }],
              isInQueue: false
            });
          }
        } 
        // 如果是用户人设提示词，保留当前选中的用户角色信息（如果有的话）
        else if (prompt.id === 'user-role-prompt') {
          if (hasSelectedUserCharacter && currentUserRolePrompt) {
            // 有选中用户角色，使用当前角色信息
            orderedPrompts.push({
              ...prompt,
              name: currentUserRolePrompt.name,
              parts: currentUserRolePrompt.parts,
              isInQueue: false
            });
          } else {
            // 没有选中用户角色，使用空内容
            orderedPrompts.push({
              ...prompt,
              name: '用户人设',
              parts: [{ text: '' }],
              isInQueue: false
            });
          }
        }
        // 如果是主提示词，保留当前内容（如果有的话）
        else if (prompt.id === 'main-prompt') {
          if (hasMainPromptContent && currentMainPrompt) {
            // 有内容，使用当前内容
            orderedPrompts.push({
              ...prompt,
              name: currentMainPrompt.name,
              parts: currentMainPrompt.parts,
              isInQueue: false
            });
          } else {
            // 没有内容，使用空内容
            orderedPrompts.push({
              ...prompt,
              name: '主提示词',
              parts: [{ text: '' }],
              isInQueue: false
            });
          }
        }
        else {
          orderedPrompts.push({
            ...prompt,
            isInQueue: false  // 不在promptsList中的标记为非队列中
          });
        }
      }
    }
    
    console.log("重新排序后的提示词:", orderedPrompts.map(p => ({id: p.id, name: p.name, isInQueue: p.isInQueue})));
    
    // 2. 更新提示词状态
    if (onReorderPrompts) {
      onReorderPrompts(orderedPrompts);
    }
    
    // 3. 设置当前活动预设
    setActivePreset(presetId);
  }, [presets, promptCollection, onReorderPrompts, setActivePreset]);

  // 处理保存预设
  const handleSavePreset = useCallback((name: string, description: string, author: string) => {
    if (!promptCollection) return;
    
    // 保存当前提示词队列为预设
    saveCurrentAsPreset(name, description, author, promptCollection, queuedPromptsIds);
  }, [promptCollection, queuedPromptsIds, saveCurrentAsPreset]);

  // 处理导入预设
  const handleImportPreset = useCallback(async (file: File) => {
    try {
      // 导入预设
      const newPresetId = await importPresetFromFile(file);
      
      // 应用导入的预设
      handleApplyPreset(newPresetId);
    } catch (error) {
      console.error('导入预设失败:', error);
      alert(`导入预设失败: ${error.message}`);
    }
  }, [importPresetFromFile, handleApplyPreset]);

  // 处理保存预设按钮点击
  const handleSavePresetClick = useCallback(() => {
    setIsPresetModalOpen(true);
  }, []);

  // 获取文件图标
  const getFileIcon = (fileType?: FileMessageType, mimeType?: string) => {
    if (!fileType) return null;
    
    switch(fileType) {
      case FileMessageType.IMAGE:
        return <Image size={16} className="text-green-400" />;
      case FileMessageType.TEXT:
        return <FileText size={16} className="text-green-400" />;
      case FileMessageType.PDF:
        return <FileText size={16} className="text-green-400" />;
      default:
        return <File size={16} className="text-green-400" />;
    }
  };
  
  // 格式化文件大小
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  return (
    <div className={`${bgColor} ${textColor} h-full flex flex-col overflow-hidden relative`}>
      {/* 矩阵背景效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg h-full w-full"></div>
      </div>
      
      {/* 预设管理器组件 */}
      <PresetManager
        theme={theme}
        fontSize={fontSize}
        presets={presets}
        activePresetId={activePresetId}
        promptCollection={promptCollection || []}
        queuedPromptsIds={queuedPromptsIds}
        onChangePreset={handleApplyPreset}
        onSaveClick={handleSavePresetClick}
        onImportPreset={handleImportPreset}
        onExportPreset={exportPreset}
      />
      
      {/* 保存预设模态框 */}
      <SavePresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSave={handleSavePreset}
      />
      
      {/* 工具栏组件 */}
      <PromptToolbar 
        theme={theme}
        fontSize={fontSize}
        selectedPromptId={selectedPromptId}
        onPromptSelect={handlePromptSelect}
        onInsertPrompt={handleInsertPrompt}
        onAddPrompt={handleAddPrompt}
        onDebugClick={handleDebugClick}
        prompts={promptCollection || []}
      />

      {/* 提示词列表组件 */}
      <PromptList
        theme={theme}
        fontSize={fontSize}
        queuedPrompts={queuedPrompts}
        expandedPromptId={expandedPromptId}
        onToggleExpand={handleToggleExpand}
        onRemoveFromQueue={handleRemoveFromQueue}
        onToggleEnabled={handleToggleEnabled}
        onEditClick={handleEditClick}
        draggedItemId={draggedItemId}
        dragOverItemId={dragOverItemId}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        getFileIcon={getFileIcon}
        formatFileSize={formatFileSize}
      />
      
      {/* 底部调试按钮 */}
      <div className={`p-2 ${toolbarBgColor} border-t border-green-500 border-opacity-30 relative z-10`}>
        <Button
          variant="ghost"
          size="sm"
          className={`${textColor} font-mono p-1.5 rounded border border-green-500 border-opacity-50 ${buttonHoverBg} w-full flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
          onClick={handleDebugClick}
          title="调试：打印当前提示词队列"
          disabled={false}
        >
          <Bug className="w-4 h-4" />
          <span className="tracking-wider">DEBUG_QUEUE</span>
        </Button>
      </div>
      
      {/* CSS样式 */}
      <style jsx>{`
        .matrix-bg {
          background-image: 
            linear-gradient(90deg, transparent 98%, rgba(0, 255, 65, 0.03) 100%),
            linear-gradient(180deg, transparent 98%, rgba(0, 255, 65, 0.03) 100%);
          background-size: 20px 20px;
          animation: matrix-scroll 20s linear infinite;
        }
        
        @keyframes matrix-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        
        .matrix-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.05) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes dragPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default PromptManager;
