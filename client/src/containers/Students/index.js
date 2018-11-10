import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { MainImageBlock, StudentCard } from 'components/common';
import { LevelUpSlider } from 'components/sections';

import { fetchStudents } from "actions/students-action.js";

import Slider from 'react-slick';
import { selectLanguage } from 'translate';

import './style.scss';

const mapStateToProps = ({students}) => ({students});

@connect(mapStateToProps, {fetchStudents})
export default class Students extends PureComponent{

    state = {
        isSliderOpen: false,
        key: null,
        arrow: null,
    };

    componentDidMount(){
        this.props.fetchStudents();
    }

    openSlider = (key) => {
        this.setState({ isSliderOpen: true, key }, () => {
            this.checkChevrons();
        });
    };

    checkChevrons = () => {
        if(this.state.key === 0) {
            this.setState({ arrow: 'prev' })
        } else if(this.state.key === this.props.students.payload.data.studentsInfo.length - 1){
            this.setState({ arrow: 'next' })
        }
        else {
            this.setState({ arrow: null })
        }
    };

    onClose = () => this.setState({ isSliderOpen: false });

    settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        cssEase: "linear",
    };

    generateStudentsImages = () => (
        this.props.students && this.props.students.payload.data.studentsImages.map((item, key) => (
            <MainImageBlock
                key={key}
                path={item}
            />
        ))
    );

    prevSlide = (key) => {
        if(this.state.key > 0 ){
            this.setState({ key: key-1 })
        }
        if(this.state.key === 1) {
            this.setState({ arrow: 'prev' })
        } else {
            this.setState({ arrow: null })
        }
    };

    nextSlide = (key) => {
        if(this.state.key < this.props.students.payload.data.studentsInfo.length - 1) {
            this.setState({ key: key+1 })
        }
        if(this.state.key === this.props.students.payload.data.studentsInfo.length - 2) {
            this.setState({ arrow: 'next' })
        } else {
            this.setState({ arrow: null })
        }
    };

    generateStudents = () => (
        this.props.students && this.props.students.payload.data.studentsInfo.map((student, key) => (
            <StudentCard
                openSlider={()=> this.openSlider(key)}
                url={student.imgUrl}
                course={student.course}
                name={student.name}
                key={key}
            />
        ))
    );

    render(){
        return(
            <div className="Students">
                <Slider {...this.settings}>
                    {this.generateStudentsImages()}
                </Slider>
                <div className="page-content students-content">
                    <h2 className="header-text">{selectLanguage(this.props.match.params.lang).header_students} <div className="divider"/></h2>
                    <div className="studetns-cards flexible jAround wrap">
                        {this.generateStudents()}
                        {
                            this.state.isSliderOpen &&
                            <LevelUpSlider
                                data={this.props.students && this.props.students.payload.data.studentsInfo[this.state.key]}
                                onClose={this.onClose}
                                nextSlide={this.nextSlide}
                                prevSlide={this.prevSlide}
                                slideKey={this.state.key}
                                arrow={this.state.arrow}
                                key={this.state.arrow}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }
}