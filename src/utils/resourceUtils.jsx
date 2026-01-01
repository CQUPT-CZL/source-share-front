import React from 'react';
import { 
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileArchive,
  MonitorPlay 
} from 'lucide-react';

const FILE_TYPES = {
  image: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: FileImage,
    label: 'IMAGE'
  },
  pdf: {
    extensions: ['pdf'],
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    icon: FileText,
    label: 'PDF'
  },
  word: {
    extensions: ['doc', 'docx'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: FileText,
    label: 'WORD'
  },
  text: {
    extensions: ['txt', 'rtf', 'md'],
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: FileText,
    label: 'TXT'
  },
  presentation: {
    extensions: ['ppt', 'pptx'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: MonitorPlay,
    label: 'SLIDE'
  },
  spreadsheet: {
    extensions: ['xls', 'xlsx', 'csv'],
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: FileSpreadsheet,
    label: 'SHEET'
  },
  code: {
    extensions: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp'],
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: FileCode,
    label: 'CODE'
  },
  archive: {
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: FileArchive,
    label: 'ARCHIVE'
  },
  video: {
    extensions: ['mp4', 'mov', 'avi', 'mkv'],
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: FileVideo,
    label: 'VIDEO'
  },
  audio: {
    extensions: ['mp3', 'wav', 'ogg'],
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: FileAudio,
    label: 'AUDIO'
  }
};

export const getFileConfig = (extension) => {
  const ext = extension?.toLowerCase() || '';
  
  for (const type in FILE_TYPES) {
    if (FILE_TYPES[type].extensions.includes(ext)) {
      return FILE_TYPES[type];
    }
  }
  
  return {
    color: 'text-slate-400',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: File,
    label: ext.toUpperCase() || 'FILE'
  };
};

export const getFileIcon = (extension) => {
  const config = getFileConfig(extension);
  const Icon = config.icon;
  return <Icon className={`w-8 h-8 ${config.color}`} strokeWidth={1.5} />;
};

export const formatSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '--';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

export const formatTime = (isoString) => {
  if (!isoString) return '--';
  try {
      const date = new Date(isoString);
      return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
      }).replace(/\//g, '-');
  } catch {
      return isoString;
  }
};
