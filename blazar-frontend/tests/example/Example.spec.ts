// @ts-nocheck
import { shallowMount } from '@vue/test-utils';
import ExampleComponent from './ExampleComponent';

describe('Example', () => {
  const exampleStubs = {
    message: 'hello world',
  };
  const component = shallowMount(ExampleComponent, {
    props: exampleStubs,
  });

  it('ExampleComponent.vue to be defined', () => {
    expect(component.vm).toBeDefined();
  });

  it('It has a "p" tag with "' + exampleStubs.message + '" like your content', () => {
    const p = component.find('p');

    expect(p.text()).toEqual(exampleStubs.message);
  });
});
