import { Analyzer } from './crawler';


export default class OtherAnalyzer implements Analyzer {
  

  public analyze(html: string, filePath: string) {
    return html;
  }
}