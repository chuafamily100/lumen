import React from 'react'
import { Box, TextField } from '@material-ui/core'
import { withStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import ActionButton from './ActionButton';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
    disabledInput: {
        color: theme.palette.text.primary,
    },
})

class EditableSetting extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enableEdit: false,
            currentValue: this.props.currentValue,
        }
    }

    componentWillMount() {
        this.props.deviceConnector.connect(this)
    }

    componentWillUnmount() {
        this.props.deviceConnector.disconnect(this)
    }

    onCommandResponse(cmnd, success, response) {
        if (cmnd.toLowerCase().startsWith(this.props.command.toLowerCase()) && success) {
            this.setState({ currentValue: response[this.props.command] })
        }
    }

    save(event) {
        event.stopPropagation()
        this.props.deviceConnector.performCommandOnDevice(`${this.props.command} ${this.state.currentValue}`)
        this.setState({ enableEdit: false })
    }

    render() {
        const { classes } = this.props
        return (
            <Box display="flex" flexDirection="row" flexGrow={0} flexShrink={1} justifyContent="center">
                <TextField
                    key={'editable-setting' + this.props.command}
                    disabled={this.state.enableEdit ? 0 : 1}
                    id={'id' + this.props.command}
                    label={this.props.label}
                    color="primary"
                    margin="normal"
                    value={this.state.currentValue}
                    InputProps={{ classes: { disabled: classes.disabledInput } }}
                    onChange={(event) => this.setState({ currentValue: event.target.value })}
                />

                {!this.state.enableEdit ?
                    <React.Fragment>
                        <ActionButton
                            toolTip="Edit"
                            label="edit"
                            icon={<EditIcon />}
                            onButtonClick={() => this.setState({ enableEdit: true })}
                        />
                    </React.Fragment>
                    :
                    (
                        <React.Fragment>
                            <ActionButton
                                toolTip="Save"
                                label="save"
                                icon={<DoneIcon />}
                                onButtonClick={(event) => this.save(event)}

                            />
                        </React.Fragment>
                    )
                }

                <ActionButton
                    visibility={this.state.enableEdit ? "visible" : "hidden"}
                    toolTip="Cancel"
                    label="cancel"
                    icon={<CancelIcon />}
                    onButtonClick={(event) => this.setState({ enableEdit: false })}
                />

            </Box>

        )
    }
}

export default withStyles(styles)(EditableSetting)