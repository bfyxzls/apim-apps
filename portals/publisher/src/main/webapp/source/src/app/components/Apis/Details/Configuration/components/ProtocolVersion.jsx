/*
 * Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { isRestricted } from 'AppData/AuthManager';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import MCPServer from 'AppData/MCPServer';

export const MCP_PROTOCOL_VERSIONS = ['2025-06-18', '2026-07-28'];

export const DEFAULT_MCP_PROTOCOL_VERSION = '2025-06-18';

/**
 * Protocol version selector for MCP Servers (southbound backend dialect).
 * @param {Object} props - Component props
 * @returns {React.Component} Protocol version select field
 */
export default function ProtocolVersion(props) {
    const { api, configDispatcher } = props;
    const [apiFromContext] = useAPI();

    if (!api || api.apiType !== MCPServer.CONSTS.MCP) {
        return null;
    }

    const isCreateOrPublishRestricted = () => isRestricted(
        ['apim:mcp_server_create', 'apim:mcp_server_publish', 'apim:mcp_server_manage'],
        apiFromContext,
    );

    return (
        <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel id='mcp-protocol-version-label'>
                <FormattedMessage
                    id='Apis.Details.Configuration.components.ProtocolVersion'
                    defaultMessage='MCP Protocol Version'
                />
            </InputLabel>
            <Select
                labelId='mcp-protocol-version-label'
                id='mcp-protocol-version'
                value={api.protocolVersion || DEFAULT_MCP_PROTOCOL_VERSION}
                label='MCP Protocol Version'
                disabled={isCreateOrPublishRestricted()}
                onChange={(e) => configDispatcher({ action: 'protocolVersion', value: e.target.value })}
            >
                <MenuItem value='2025-06-18'>
                    <FormattedMessage
                        id='Apis.Details.Configuration.components.ProtocolVersion.legacy'
                        defaultMessage='2025-06-18 (MCP 1.0)'
                    />
                </MenuItem>
                <MenuItem value='2026-07-28'>
                    <FormattedMessage
                        id='Apis.Details.Configuration.components.ProtocolVersion.modern'
                        defaultMessage='2026-07-28 (MCP 2.0)'
                    />
                </MenuItem>
            </Select>
            <FormHelperText>
                <FormattedMessage
                    id='Apis.Details.Configuration.components.ProtocolVersion.help'
                    defaultMessage={
                        'Protocol spoken by the southbound MCP backend. '
                        + 'Use 2025-06-18 for MCP 1.0 backends and 2026-07-28 for MCP 2.0 backends.'
                    }
                />
            </FormHelperText>
        </FormControl>
    );
}

ProtocolVersion.propTypes = {
    api: PropTypes.shape({
        apiType: PropTypes.string,
        protocolVersion: PropTypes.string,
    }).isRequired,
    configDispatcher: PropTypes.func.isRequired,
};
