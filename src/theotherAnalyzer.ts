
import { AnalyzerInterface } from './crawler';

export default class Analyzer implements AnalyzerInterface {
  public analyze(html: string, filePath: string) {
    return html;
  }
}