import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { compose } from "redux";
import { withFormik } from "formik";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText"
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import Map from "../../common/GoogleMap";
import MapTypes from "../../common/GoogleMap/utils/map-types";
import MyServices from '../my-services/index';

import { createService } from "./service-request"
import { loadServices } from "../../../redux/actions/my-services";

import style from "./style.scss";

const cx = classNames.bind(style)

class Service extends Component {

    componentDidMount(){
        const { loadMyServices } = this.props;
        loadMyServices();
    }

    render(){
        const { service:{distanceInKilo,
            distanceInMile,
            durationText},
            values,
            handleChange,
            handleSubmit,
            isSubmitting,
            myServices,
        } = this.props
        return (
            <React.Fragment>
                <h1>service</h1>
                <Grid spacing={16}
                  container
                 >
                    <Grid item xs={6} >
                        <Paper className={cx('container-form')}>
                        <form className={cx("form")} onSubmit={handleSubmit}>
                            <TextField
                            id="origin"
                            label="Origin"
                            className={cx("input")}
                            margin="normal"
                            />
                            <TextField
                            id="destination"
                            label="Destination"
                            type="text"
                            className={cx("input")}
                            margin="normal"
                            />
                            <TextField
                            id="description"
                            label="Description"
                            value={values.description}
                            onChange={handleChange}
                            type="text"
                            className={cx("input")}
                            margin="normal"
                            />
                         <Button variant="contained" type="submit" color="primary" disabled={isSubmitting}  className={cx("button-service")}>
                            <p className={cx("button__label")}>Confirm Service</p>
                            {isSubmitting && <CircularProgress size={20} />}
                          </Button>
                        </form>
                        </Paper>
                        <Paper className={cx('container-list')}>
                              <List className={cx("list")}>
                                <ListItem>
                                <ListItemText
                                    primary="Millas: "/><Chip
                                            label={distanceInMile}
                                    />
                                </ListItem>
                                <ListItem>
    
                                    <ListItemText
                                    primary="Km: "/> <Chip
                                        label={distanceInKilo}
                                    />
                                </ListItem>
                                <ListItem>
                                <ListItemText
                                    primary="Time: "/> <Chip
                                        label={durationText}
                                    />
                                </ListItem>
                            </List>
                           </Paper>   
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={cx("map-container")}>
                                <Map
                                        options={{
                                            center: { lat: -33.8688, lng: 151.2195 }
                                        }}
                                        id="map-place"
                                        origin="origin"
                                        destination="destination"
                                        type={MapTypes.places}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <MyServices myServices={myServices}/>
                        </Grid>
                </Grid>
    
            </React.Fragment>
        );
    }

}

const mapStateToProps = state =>  ({
        service: state.service,
        user: state.user,
        myServices: state.myServices
    })
 
const mapDispatchToProps = dispatch => ({
    loadMyServices: () => dispatch(loadServices())
})

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withFormik({
        handleSubmit: async (values, { props, setSubmitting }) => {
            const { user, service, loadMyServices } = props

            const data = {
                user,
                location: service,
                description: values.description
            }

          const response = await createService(data);
      
          setSubmitting(false);

          if (response.data) {
            toast.success("Confirm service succesfully", {
                position: toast.POSITION.TOP_RIGHT
              });
              loadMyServices();
          } else {
            toast.error("Error when confirm service", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        }
      })
)(Service);
