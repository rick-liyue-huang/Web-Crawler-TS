
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

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

class Crawler {
  private secret = `x3b174jsx`;
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  // private rawHTML = ``;

  constructor() {
    this.initCrawlerProcess();
  }

  async initCrawlerProcess() {
    const filePath = path.resolve(__dirname, '../data/course.json');
    const html = await this.getRawHTML();
    const courseInfo = this.getCourseInfo(html);
    // console.log(courseResult);
    const fileContent = this.generateJSONContent(courseInfo);
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }

  async getRawHTML() {
    const result = await superagent.get(this.url);
    // console.log(result.text);
    // this.rawHTML = result.text;
    // this.getCourseInfo(this.rawHTML);
    return result.text;
  }

  getCourseInfo(html: string) {
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

  generateJSONContent(courseResult: CourseResult) {
    const filePath = path.resolve(__dirname, '../data/course.json');
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseResult.time] = courseResult.data;
    return fileContent;
  }
}

const crawler = new Crawler();