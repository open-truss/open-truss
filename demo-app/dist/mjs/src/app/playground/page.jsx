var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseYaml, applyConfiguration } from '@open-truss/open-truss';
import * as COMPONENTS from '@/open-truss-components';
import React from 'react';
const configurationFunction = applyConfiguration(COMPONENTS);
function PlaygroundPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedConfig = parseYaml(config);
        const renderedComponents = configurationFunction(parsedConfig, {});
        return <>
    {renderedComponents}
  </>;
    });
}
export default PlaygroundPage;
const config = `
workflow:
  version: 1
  frames:
    - frame:
      data: foo
      view:
        component: Foo
        props:
          color: blue
      frames:
        - frame:
          data: bar
          view:
            component: OTBar
            props:
              color: blue
`;
