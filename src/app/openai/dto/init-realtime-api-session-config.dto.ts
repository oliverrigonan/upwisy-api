import { ApiProperty } from "@nestjs/swagger";

export class InitializeRealtimeApiSessionConfigDto {
    @ApiProperty()
    model: string;

    @ApiProperty()
    voice: string;

    @ApiProperty()
    modalities: string[];

    @ApiProperty()
    instructions: string;

    @ApiProperty()
    input_audio_format: string;

    @ApiProperty()
    output_audio_format: string;

    @ApiProperty()
    tools: any[];

    @ApiProperty()
    turn_detection: {
        type: string;
        threshold: number;
        prefix_padding_ms: number;
        silence_duration_ms: number;
        create_response: boolean;
        interrupt_response: boolean;
    };
}
