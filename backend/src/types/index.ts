/**
 * 类型定义模块 - 定义系统核心数据结构
 *
 * 包含以下类型：
 * - 数据库实体类型（User, Session, Message）
 * - 请求DTO类型（LoginDto, RegisterDto, CreateMessageDto）
 * - API响应类型（ApiResponse, StreamResponse）
 * - 请求扩展类型（AuthRequest）
 */

/**
 * 用户实体
 */
export interface User {
  id: string;
  email: string;
  nickname: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 会话实体
 */
export interface Session {
  id: string;
  userId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 消息实体
 */
export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

/**
 * 认证请求扩展类型
 * 在中间件中注入 userId
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * 登录请求DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * 注册请求DTO
 */
export interface RegisterDto {
  email: string;
  password: string;
  nickname?: string;
}

/**
 * 创建消息请求DTO
 */
export interface CreateMessageDto {
  sessionId?: string;
  content: string;
}

/**
 * API响应统一格式
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 流式响应格式
 */
export interface StreamResponse {
  type: "token" | "done" | "error";
  content?: string;
  messageId?: string;
  message?: string;
}
