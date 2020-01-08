import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';

const Profiles =({ getProfiles, profile: {Profiles, loading}}) => {

    useEffect(() => {
        getProfiles();
    }, []);
    return <Fragment>
        { loading ? <Spinner /> : <Fragment>
            <h1 className='large text-primary'>Developers</h1>
            <p className="lead">
                <i className='fab fa-connectdevelop'></i>Browse and connect with developers</p>
                <div className='profiles'>
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <ProfileItem key={profile._id} profile={profie} />
                        ))
                    ) : <h4> No profiles found</h4> }
                </div>
                </Fragment>}
    </Fragment>
}

Profiles.propTypes = {
    getProfiles: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, {getProfiles})(Profiles)
