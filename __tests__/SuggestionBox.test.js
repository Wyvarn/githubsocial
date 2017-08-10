import expect from 'expect';
import React from 'react';
import {mount, shallow} from 'enzyme';
import SuggestionBox from '../src/components/suggestion/SuggestionBox';

function setup() {
    const props = {
        //TODO: props
    };

    return shallow(<SuggestionBox {...props}/>);
}

describe("SuggestionBox should", () => {

    it("render without crashing", () => {
        const wrapper = setup();
        expect(wrapper.find("div").length).toBe(1);
    });

    // TODO: other test cases
});