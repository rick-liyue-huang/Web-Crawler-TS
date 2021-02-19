
import fs from 'fs';
import cheerio from 'cheerio';
import { AnalyzerInterface } from './crawler';

interface Course {
  title: string;
  count: number
}

interface CourseResult {
  time: number;
  data: Course[]
}

interface Content {
  [propname: number]: Course[]
}

export default class Analyzer implements AnalyzerInterface {

  private constructor() {}

  private static instance: Analyzer;

  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer();
    }
    return Analyzer.instance;
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    const courseInfos: Course[] = [];

    // console.log(courseItems.length);
    courseItems.map((index, element) => {
      const descs = $(element).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split('：')[1], 10);
      courseInfos.push({title, count});

      // console.log(title, count);
    });

    const result = {
      time: (new Date()).getTime(),
      data: courseInfos 
    }
    console.log(result)
    return result;
  }

  private generateJSONContent(courseResult: CourseResult, filePath: string) {
    // const filePath = path.resolve(__dirname, '../../data/course.json');
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseResult.time] = courseResult.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJSONContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }
}