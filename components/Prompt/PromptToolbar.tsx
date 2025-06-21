import React from "react";
import { Plus, Trash2, Download, Upload, PlusCircle, Bug } from "lucide-react";
import { ChatMessage } from "../../types";

// 临时组件实现
const Button = ({ children, className, variant, size, onClick, title, disabled = false }) => (
  <button 
    className={className}
    onClick={onClick}
    title={title}
    disabled={disabled}
  >
    {children}
  </button>
);

const Select = ({ children, value, onChange, className, defaultValue = "" }) => (
  <select value={value} onChange={onChange} className={className} defaultValue={defaultValue}>
    {children}
  </select>
);

interface PromptToolbarProps {
  theme?: string;
  fontSize?: string;
  selectedPromptId: string;
  onPromptSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInsertPrompt: () => void;
  onAddPrompt: () => void;
  onDebugClick: () => void;
  prompts: ChatMessage[];
}

const PromptToolbar: React.FC<PromptToolbarProps> = ({
  theme = "dark",
  fontSize = "medium",
  selectedPromptId,
  onPromptSelect,
  onInsertPrompt,
  onAddPrompt,
  onDebugClick,
  prompts
}) => {
  // 黑客帝国风格样式
  const textColor = 'text-green-400';
  const headerTextColor = 'text-green-300';
  const toolbarBgColor = 'bg-black bg-opacity-80 backdrop-blur-sm';
  const selectBgColor = 'bg-black';
  const selectBorderColor = 'border-green-500 border-opacity-50';
  const buttonHoverBg = 'hover:bg-green-500 hover:bg-opacity-20';

  // 筛选可选择的提示词（排除系统、用户输入和历史记录）
  const selectablePrompts = prompts.filter(p => !p.isSystem && !p.isUserInput && !p.isHistory);

  // 获取提示词显示名称
  const getPromptDisplayName = (prompt: ChatMessage): string => {
    const roleName = prompt.role === 'user' ? '用户' : prompt.role === 'model' ? '模型' : '错误';
    const name = prompt.name || '未命名提示词';
    return `${name} (${roleName})`;
  };

  return (
    <div className={`flex flex-col gap-2 p-2 ${toolbarBgColor} border-b border-green-500 border-opacity-30 relative z-10`}>
      {/* 下拉选择行 */}
      <div className="w-full relative z-10">
        <Select 
          value={selectedPromptId} 
          onChange={onPromptSelect}
          className={`${selectBgColor} border ${selectBorderColor} ${textColor} font-mono w-full p-1.5 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 focus:shadow-lg focus:shadow-green-500/20`}
        >
          <option value="" className="bg-black text-green-400">选择提示词</option>
          {selectablePrompts.map(prompt => (
            <option key={prompt.id} value={prompt.id} className="bg-black text-green-400">
              {getPromptDisplayName(prompt)}
            </option>
          ))}
        </Select>
      </div>

      {/* 按钮行 */}
      <div className="flex items-center justify-between flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 ${!selectedPromptId ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="插入提示词到队列"
          onClick={onInsertPrompt}
          disabled={!selectedPromptId}
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
          title="删除选中的提示词"
          onClick={() => {
            console.log("删除提示词功能待实现");
          }}
          disabled={false}
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
          title="导入提示词队列"
          onClick={() => {
            console.log("导入提示词队列功能待实现");
          }}
          disabled={false}
        >
          <Download className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
          title="导出提示词队列"
          onClick={() => {
            console.log("导出提示词队列功能待实现");
          }}
          disabled={false}
        >
          <Upload className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`${headerTextColor} font-mono p-1.5 rounded border border-green-500 border-opacity-30 ${buttonHoverBg} transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20`}
          title="添加新提示词"
          onClick={onAddPrompt}
          disabled={false}
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptToolbar;
