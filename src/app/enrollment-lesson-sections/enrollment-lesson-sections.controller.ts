import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';
import { CreateEnrollmentLessonSectionDto } from './dto/create-enrollment-lesson-section.dto';
import { UpdateEnrollmentLessonSectionDto } from './dto/update-enrollment-lesson-section.dto';

@Controller('enrollment-lesson-sections')
export class EnrollmentLessonSectionsController {
  constructor(private readonly enrollmentLessonSectionsService: EnrollmentLessonSectionsService) {}

  @Post()
  create(@Body() createEnrollmentLessonSectionDto: CreateEnrollmentLessonSectionDto) {
    return this.enrollmentLessonSectionsService.create(createEnrollmentLessonSectionDto);
  }

  @Get()
  findAll() {
    return this.enrollmentLessonSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentLessonSectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentLessonSectionDto: UpdateEnrollmentLessonSectionDto) {
    return this.enrollmentLessonSectionsService.update(+id, updateEnrollmentLessonSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentLessonSectionsService.remove(+id);
  }
}
