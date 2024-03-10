import {combineRgb} from '@companion-module/base';
import {getDefaultStyleGreen} from '../../../defaults';
import {CompanionButtonPresetDefinition} from '@companion-module/base/dist/module-api/preset';

export function triggerLayerGroupColumnPreset(): CompanionButtonPresetDefinition {return {
	type: 'button',
	category: 'Layer Group',
	name: 'Trigger Layer Group Column',
	style: {
		size: '14',
		text: 'Trigger Layer Group Column',
		color: combineRgb(255, 255, 255),
		bgcolor: combineRgb(0, 0, 0)
	},
	steps: [
		{
			down: [
				{
					actionId: 'triggerLayerGroupColumn',
					options: {
						layerGroup: '1',
						action: 'set',
						value: 1
					}
				}
			],
			up: []
		}
	],
	feedbacks: [
		{
			feedbackId: 'layerGroupColumnsSelected',
			options: {
				column: '1',
				layerGroup: '1'
			},
			style: getDefaultStyleGreen()
		},
		{
			feedbackId: 'layerGroupColumnName',
			options: {
				layerGroup: '1',
				column: '1'
			}
		}

	]
}}