export type PcmAudioFormat = {
  type?: "audio/pcm";
  rate?: 24000;
};

export type PcmuAudioFormat = {
  type?: "audio/pcmu";
};

export type PcmaAudioFormat = {
  type?: "audio/pcma";
};

export type InputAudioFormat =
  | PcmAudioFormat
  | PcmuAudioFormat
  | PcmaAudioFormat;

export type NoiseReductionConfig = {
  type?: "near_field" | "far_field";
} | null;

export type TranscriptionConfig = {
  language?: string;
  model?: "whisper-1" | "gpt-4o-mini-transcribe" | "gpt-4o-transcribe" | "gpt-4o-transcribe-diarize";
  prompt?: string;
} | null;

export type ServerVadConfig = {
  type: "server_vad";
  create_response?: boolean;
  idle_timeout_ms?: number;
  interrupt_response?: boolean;
  prefix_padding_ms?: number;
  silence_duration_ms?: number;
  threshold?: number;
};

export type SemanticVadConfig = {
  type: "semantic_vad";
  create_response?: boolean;
  eagerness?: "auto" | "low" | "medium" | "high";
  interrupt_response?: boolean;
};

export type TurnDetectionConfig =
  | ServerVadConfig
  | SemanticVadConfig
  | null;

export type OutputAudioFormat =
  | PcmAudioFormat
  | PcmuAudioFormat
  | PcmaAudioFormat;

export type PromptReference = {
  id: string;
  variables?: Record<string, any>;
  version?: string;
};

export type ToolChoiceMode = "none" | "auto" | "required";

export type ForceFunctionTool = {
  name: string;
  type: "function";
};

export type ForceMcpTool = {
  server_label: string;
  type: "mcp";
  name?: string;
};

export type ToolChoice = ToolChoiceMode | ForceFunctionTool | ForceMcpTool;

export type FunctionToolDefinition = {
  description?: string;
  name?: string;
  parameters?: object;
  type?: "function";
};

export type McpAllowedTools =
  | string[]
  | {
    read_only?: boolean;
    tool_names?: string[];
  };

export type RequireApproval =
  | {
    always?: { read_only?: boolean; tool_names?: string[] };
    never?: { read_only?: boolean; tool_names?: string[] };
  }
  | "always"
  | "never";

export type McpToolDefinition = {
  server_label: string;
  type: "mcp";
  allowed_tools: McpAllowedTools;
  authorization?: string;
  connector_id?: string;
  headers?: Record<string, string>;
  require_approval?: RequireApproval;
  server_description?: string;
  server_url?: string;
};

export type TracingAuto = "auto";

export type TracingConfig = {
  group_id?: string;
  metadata?: Record<string, any>;
  workflow_name?: string;
};

export type Tracing = TracingAuto | TracingConfig | null;

export type TruncationMode = "auto" | "disabled";

export type RetentionRatioTruncation = {
  retention_ratio: number;
  type: "retention_ratio";
  token_limits?: {
    post_instructions?: number;
  };
};

export type Truncation = TruncationMode | RetentionRatioTruncation;

export class SessionConfig {
  type: string = "realtime";
  model?: string;
  audio?: {
    input?: {
      format?: InputAudioFormat;
      noise_reduction?: NoiseReductionConfig;
      transcription?: TranscriptionConfig;
      turn_detection?: TurnDetectionConfig;
    };
    output?: {
      format?: OutputAudioFormat;
      speed?: number;
      voice?: "alloy" | "ash" | "ballad" | "coral" | "echo" | "sage" | "shimmer" | "verse" | "marin" | "cedar";
    };
  };
  include?: string[];
  instructions?: string;
  max_output_tokens?: number | "inf";
  output_modalities?: ("audio" | "text")[];
  prompt?: PromptReference;
  tool_choice?: ToolChoice;
  tools?: (FunctionToolDefinition | McpToolDefinition)[];
  tracing?: Tracing;
  truncation?: Truncation;
}
