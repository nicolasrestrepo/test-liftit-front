import React from "react";
// import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import classNames from "classnames/bind";

import styles from "./style.scss";

const cx = classNames.bind(styles);

function MyServices(props) {
    const { myServices } = props;
	return (
		<Paper className={cx("table")}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Description</TableCell>
							<TableCell>Origin</TableCell>
							<TableCell>Destination</TableCell>
							<TableCell>Distance (KM)</TableCell>
							<TableCell>Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{myServices.map(service => (
							<TableRow key={service._id}>
								<TableCell>{service.description}</TableCell>
								<TableCell>{service.location ? service.location.origin : ''}</TableCell>
								<TableCell>{service.location ? service.location.destination : ''}</TableCell>
								<TableCell>{service.location ? service.location.distanceInKilo : ''}</TableCell>
								<TableCell>{service.location ? service.location.durationText: ''}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
		</Paper>
	);
}
// const mapStateToProps = state => ({
// 	myServices: state.myServices
// });

export default MyServices;
