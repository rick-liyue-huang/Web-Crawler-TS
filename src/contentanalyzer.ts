import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crawler';

interface Course  {
  title: string,
  count:  number
}

interface CourseResult {
  time: number,
  data: Course[]
}

/**
 * define the courseinfo.json content type
 */
interface Content {
  [propName: number]: Course[]
}


export default class ContentAnalyzer implements Analyzer {
  /**
   * get items from webpage and store in array
   * @param html 
   */
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    // console.log(courseItems.length);
    const courseInfos: Course[] = [];  // define the courseInfo object type by interface
    courseItems.map((index, elem) => {
      const descs = $(elem).find('.course-desc');
      const title = descs.eq(0).text();
      // console.log(title);
      const count = parseInt(descs.eq(1).text().split('：')[1], 10);
      // console.log(title, count);

      courseInfos.push({
        title, count
      });
    });

    const result = {  // add time stamp on result
      time: (new Date()).getTime(),
      data: courseInfos
    }
    // console.log(result);
    return result;
  }

  private generateJSONContent(courseResult: CourseResult, filePath: string) {
    // const filePath = path.resolve(__dirname, '../data/courseinfo.json');
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8')); 
    }
    fileContent[courseResult.time] = courseResult.data;
    return fileContent;
    // fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJSONContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }
}